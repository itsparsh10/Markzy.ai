import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import User from '../../../services/models/User.js';
import Subscription from '../../../services/models/Subscription.js';
import PaymentHistory from '../../../services/models/PaymentHistory.js';

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    await dbConnect();
    console.log('Database connected successfully');

    // Test model operations
    const userCount = await User.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const paymentHistoryCount = await PaymentHistory.countDocuments();

    // Test creating a test user
    const testUser = new User({
      email: 'test@example.com',
      name: 'Test User',
      password: 'test_password',
      role: 'user',
      isActive: true
    });

    await testUser.save();
    console.log('Test user created:', testUser._id);

    // Test creating a test subscription
    const testSubscription = new Subscription({
      subscriptionId: 'test_subscription_123',
      userId: testUser._id,
      amount: 29.99,
      currency: 'USD',
      subscriptionName: 'Test Plan',
      type: 'monthly',
      duration: 30,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSessionId: 'test_session_123',
      metadata: {
        planId: 'test_plan',
        customerEmail: 'test@example.com'
      }
    });

    await testSubscription.save();
    console.log('Test subscription created:', testSubscription._id);

    // Test creating a test payment history
    const testPaymentHistory = new PaymentHistory({
      userId: testUser._id,
      userName: 'Test User',
      userEmail: 'test@example.com',
      subscriptionId: 'test_subscription_123',
      planName: 'Test Plan',
      planId: 'test_plan',
      createdDate: new Date(),
      amount: 29.99,
      status: 'success',
      invoiceUrl: 'https://example.com/invoice',
      metadata: {
        planType: 'monthly',
        originalAmount: 29.99,
        currency: 'USD'
      }
    });

    await testPaymentHistory.save();
    console.log('Test payment history created:', testPaymentHistory._id);

    // Clean up test data
    await User.findByIdAndDelete(testUser._id);
    await Subscription.findByIdAndDelete(testSubscription._id);
    await PaymentHistory.findByIdAndDelete(testPaymentHistory._id);

    return NextResponse.json({
      success: true,
      message: 'Database and models working correctly',
      counts: {
        users: userCount,
        subscriptions: subscriptionCount,
        paymentHistory: paymentHistoryCount
      }
    });

  } catch (error) {
    console.error('Database test failed:', error);
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