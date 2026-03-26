import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import User from '../../../services/models/User.js';
import Subscription from '../../../services/models/Subscription.js';
import PaymentHistory from '../../../services/models/PaymentHistory.js';

export async function POST(req: NextRequest) {
  try {
    const { testUserId, testEmail, testPlanName, testPlanId, testAmount } = await req.json();
    
    console.log('Test user flow request:', { testUserId, testEmail, testPlanName, testPlanId, testAmount });
    
    // Connect to database
    await dbConnect();
    console.log('Database connected for test user flow');

    // Create a test user with the provided ID
    let user = null;
    if (testUserId) {
      user = await User.findById(testUserId);
      if (!user) {
        user = await User.create({
          _id: testUserId,
          id: testUserId,
          email: testEmail || `test_${testUserId}@example.com`,
          name: `Test User ${testUserId}`,
          password: 'test_password',
          role: 'user',
          isActive: true,
          externalUserId: typeof testUserId === 'number' ? testUserId : undefined,
        });
        if (!user) throw new Error('Failed to create test user');
        console.log('Created test user:', user._id);
      } else {
        console.log('Found existing test user:', user._id);
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No user ID provided' },
        { status: 400 }
      );
    }

    // Create test subscription
    const sessionId = `test_session_${Date.now()}`;
    const subscriptionData = {
      subscriptionId: sessionId,
      userId: user._id,
      amount: testAmount || 29.99,
      currency: 'USD',
      subscriptionName: testPlanName || 'Test Plan',
      type: testPlanId === 'lifetime' ? 'lifetime' : 'monthly',
      duration: testPlanId === 'lifetime' ? -1 : 30,
      status: 'active',
      createdAt: new Date(),
      expiresAt: testPlanId === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSessionId: sessionId,
      metadata: {
        planId: testPlanId || 'test_plan',
        customerEmail: user.email,
        testFlow: true
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
      planName: testPlanName || 'Test Plan',
      planId: testPlanId || 'test_plan',
      createdDate: new Date(),
      amount: testAmount || 29.99,
      status: 'success',
      invoiceUrl: `https://dashboard.stripe.com/payments/${sessionId}`,
      metadata: {
        planType: testPlanId === 'lifetime' ? 'lifetime' : 'monthly',
        originalAmount: testAmount || 29.99,
        currency: 'USD',
        testFlow: true,
        newUser: true
      },
      paymentMethod: 'card',
      currency: 'USD',
      description: `Test payment for ${testPlanName || 'Test Plan'} subscription`,
      customerDetails: {
        name: user.name,
        email: user.email
      }
    };

    const paymentHistory = await PaymentHistory.create(paymentHistoryData);
    if (!paymentHistory) throw new Error('Failed to create payment history');
    console.log('Created payment history:', paymentHistory._id);

    const storedUser = await User.findById(user._id);
    const storedSubscription = await Subscription.findById(subscription._id);
    const storedPaymentHistory = await PaymentHistory.findById(paymentHistory._id);

    if (!storedUser || !storedSubscription || !storedPaymentHistory) {
      throw new Error('Verification read failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Test user flow completed successfully',
      data: {
        user: {
          id: storedUser._id,
          email: storedUser.email,
          name: storedUser.name,
          subscriptionId: storedUser.Subscription_id,
          isActive: storedUser.isActive,
          isNewUser: true,
        },
        subscription: {
          id: storedSubscription._id,
          subscriptionId: storedSubscription.subscriptionId,
          planName: storedSubscription.subscriptionName,
          amount: storedSubscription.amount,
          type: storedSubscription.type,
          status: storedSubscription.status,
        },
        paymentHistory: {
          id: storedPaymentHistory._id,
          userId: storedPaymentHistory.userId,
          planName: storedPaymentHistory.planName,
          amount: storedPaymentHistory.amount,
          status: storedPaymentHistory.status,
          isNewUser: (storedPaymentHistory.metadata as { newUser?: boolean })?.newUser,
        },
      },
    });

  } catch (error) {
    console.error('Test user flow error:', error);
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