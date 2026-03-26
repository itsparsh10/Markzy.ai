import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import required modules
const User = require('../../../../services/models/User');
const Subscription = require('../../../../services/models/Subscription');
const PaymentHistory = require('../../../../services/models/PaymentHistory');
const dbConnect = require('../../../../services/db');

// Get user's current membership status
async function getUserMembershipStatus(userId: string) {
  try {
    await dbConnect();
    
    const subscription = await Subscription.findOneActiveByUser(userId);
    
    if (!subscription) {
      return {
        hasActiveSubscription: false,
        planName: null,
        remainingDays: 0,
        isActive: false
      };
    }
    
    const now = new Date();
    const subscriptionDate = new Date(subscription.createdAt);
    
    let remainingDays = 0;
    let isActive = false;
    
    if (subscription.type === 'lifetime') {
      remainingDays = -1; // Lifetime
      isActive = subscription.status === 'active';
    } else {
      // Monthly subscription
      const daysSinceSubscription = Math.floor((now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24));
      remainingDays = Math.max(0, 30 - daysSinceSubscription);
      isActive = remainingDays > 0 && subscription.status === 'active';
    }
    
    return {
      hasActiveSubscription: true,
      planName: subscription.subscriptionName,
      remainingDays,
      isActive,
      subscriptionDate: subscription.createdAt,
      planType: subscription.type,
      status: subscription.status
    };
  } catch (error) {
    console.error('Error getting user membership status:', error);
    throw error;
  }
}

// Enhanced function to get comprehensive payment history
async function getComprehensivePaymentHistory(userId: string) {
  try {
    await dbConnect();
    
    // Get all payment history for the user
    const paymentHistory = await PaymentHistory.find(
      { userId },
      { sort: { createdDate: -1 }, limit: 50 }
    );
    
    // If no payment history found, try to create from subscriptions
    if (paymentHistory.length === 0) {
      console.log(`No payment history found for user ${userId}, attempting to create from subscriptions`);
      await createPaymentHistoryFromSubscriptions(userId);
      
      // Try to get payment history again
      const retryPaymentHistory = await PaymentHistory.find(
        { userId },
        { sort: { createdDate: -1 }, limit: 50 }
      );
      
      return retryPaymentHistory;
    }
    
    return paymentHistory;
  } catch (error) {
    console.error('Error getting comprehensive payment history:', error);
    return [];
  }
}

// Helper function to create payment history from existing subscriptions
async function createPaymentHistoryFromSubscriptions(userId: string) {
  try {
    const subscriptions = await Subscription.find({
      userId: userId,
      status: 'active'
    });
    
    for (const subscription of subscriptions) {
      // Check if payment history already exists for this subscription
      const existingPayment = await PaymentHistory.findOne({ 
        subscriptionId: subscription.subscriptionId 
      });
      
      if (!existingPayment) {
        // Get user details
        const user = await User.findById(userId);
        
        // Create payment history entry from subscription
        const paymentHistory = new PaymentHistory({
          userId: userId,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || 'unknown@email.com',
          subscriptionId: subscription.subscriptionId,
          createdDate: subscription.createdAt,
          amount: subscription.amount,
          status: 'success',
          planName: subscription.subscriptionName,
          planId: subscription.metadata?.planId || 'unknown',
          invoiceUrl: `https://dashboard.stripe.com/payments/${subscription.subscriptionId}`,
          metadata: {
            planType: subscription.type,
            originalAmount: subscription.amount,
            currency: subscription.currency || 'USD',
            createdFromSubscription: true
          },
          paymentMethod: 'card',
          currency: subscription.currency || 'USD',
          description: `Payment for ${subscription.subscriptionName} subscription`
        });
        
        await paymentHistory.save();
        console.log(`Created payment history from subscription: ${paymentHistory._id}`);
      }
    }
  } catch (error) {
    console.error('Error creating payment history from subscriptions:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or headers
    let token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else if (authHeader && authHeader.startsWith('bearer ')) {
        token = authHeader.replace('bearer ', '');
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    // SECURITY FIX: Always use the authenticated user's ID, not any requested user ID
    // This prevents users from accessing other users' payment data
    const targetUserId = userId; // Always use authenticated user ID
    
    if (requestedUserId && requestedUserId !== userId) {
      console.log(`⚠️  Request attempted to access user ${requestedUserId} but authenticated as ${userId}. Using authenticated user ID.`);
    }

    console.log(`Getting membership data for authenticated user: ${targetUserId}`);

    // Get membership status
    const membershipStatus = await getUserMembershipStatus(targetUserId);
    
    // Get comprehensive payment history
    const paymentHistory = await getComprehensivePaymentHistory(targetUserId);
    
    // Get user details for additional context
    const user = await User.findById(targetUserId);
    
    return NextResponse.json({
      success: true,
      data: membershipStatus,
      paymentHistory: paymentHistory,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        isActive: user?.isActive
      }
    });
  } catch (error) {
    console.error('Error getting membership status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get membership status' },
      { status: 500 }
    );
  }
} 