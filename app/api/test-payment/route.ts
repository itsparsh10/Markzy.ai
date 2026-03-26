import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import User from '../../../services/models/User.js';
import Subscription from '../../../services/models/Subscription.js';
import PaymentHistory from '../../../services/models/PaymentHistory.js';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, planId, planName, amount, userId, userEmail } = await req.json();
    
    console.log('Test payment request:', { sessionId, planId, planName, amount, userId, userEmail });
    
    if (!sessionId || !planId || !planName) {
      return NextResponse.json(
        { success: false, message: 'Session ID, Plan ID, and Plan Name are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();
    console.log('Database connected for test payment');

    // Find or create user
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }
    
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail });
    }
    
    if (!user) {
      user = await User.create({
        email: userEmail || 'test@example.com',
        name: 'Test User',
        password: 'test_password',
        role: 'user',
        isActive: true,
      });
      if (!user) throw new Error('Failed to create test user');
      console.log('Created test user:', user._id);
    }

    // Create test subscription
    const subscriptionData = {
      subscriptionId: sessionId,
      userId: user._id,
      amount: amount || 29.99,
      currency: 'USD',
      subscriptionName: planName,
      type: planId === 'lifetime' ? 'lifetime' : 'monthly',
      duration: planId === 'lifetime' ? -1 : 30,
      status: 'active',
      createdAt: new Date(),
      expiresAt: planId === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSessionId: sessionId,
      metadata: {
        planId: planId,
        customerEmail: user.email,
        testPayment: true
      }
    };

    let subscription = await Subscription.findOne({ subscriptionId: sessionId });
    
    if (subscription) {
      await Subscription.findByIdAndUpdate(subscription._id, subscriptionData);
      console.log('Updated existing subscription:', subscription._id);
    } else {
      subscription = await Subscription.create(subscriptionData);
      if (!subscription) throw new Error('Failed to create subscription');
      console.log('Created new subscription:', subscription._id);
    }

    if (!subscription) throw new Error('Missing subscription');

    // Update user subscription reference
    await User.findByIdAndUpdate(user._id, {
      Subscription_id: subscription._id,
      isActive: true,
    });

    // Create payment history
    const paymentHistoryData = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      subscriptionId: sessionId,
      planName: planName,
      planId: planId,
      createdDate: new Date(),
      amount: amount || 29.99,
      status: 'success',
      invoiceUrl: `https://dashboard.stripe.com/payments/${sessionId}`,
      metadata: {
        planType: planId === 'lifetime' ? 'lifetime' : 'monthly',
        originalAmount: amount || 29.99,
        currency: 'USD',
        testPayment: true
      },
      paymentMethod: 'card',
      currency: 'USD',
      description: `Test payment for ${planName} subscription`,
      customerDetails: {
        name: user.name,
        email: user.email
      }
    };

    const paymentHistory = new PaymentHistory(paymentHistoryData);
    await paymentHistory.save();
    console.log('Created payment history:', paymentHistory._id);

    return NextResponse.json({
      success: true,
      message: 'Test payment data created successfully',
      data: {
        userId: user._id,
        userEmail: user.email,
        subscriptionId: subscription._id,
        paymentHistoryId: paymentHistory._id,
        planName,
        planId,
        amount: amount || 29.99
      }
    });

  } catch (error) {
    console.error('Test payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 