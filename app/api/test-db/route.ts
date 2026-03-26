import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import User from '../../../services/models/User.js';
import Subscription from '../../../services/models/Subscription.js';
import PaymentHistory from '../../../services/models/PaymentHistory.js';

export async function GET(_req: NextRequest) {
  try {
    await dbConnect();

    const userCount = await User.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const paymentHistoryCount = await PaymentHistory.countDocuments();

    const uniqueEmail = `test_${Date.now()}@example.com`;
    const testUser = await User.create({
      email: uniqueEmail,
      name: 'Test User',
      password: 'test_password',
      role: 'user',
      isActive: true,
    });

    if (!testUser) {
      throw new Error('Failed to create test user');
    }

    const testSubscription = await Subscription.create({
      subscriptionId: `test_subscription_${Date.now()}`,
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
        customerEmail: uniqueEmail,
      },
    });

    if (!testSubscription) {
      throw new Error('Failed to create test subscription');
    }

    const testPaymentHistory = await PaymentHistory.create({
      userId: testUser._id,
      userName: 'Test User',
      userEmail: uniqueEmail,
      subscriptionId: testSubscription.subscriptionId,
      planName: 'Test Plan',
      planId: 'test_plan',
      createdDate: new Date(),
      amount: 29.99,
      status: 'success',
      invoiceUrl: 'https://example.com/invoice',
      metadata: {
        planType: 'monthly',
        originalAmount: 29.99,
        currency: 'USD',
      },
    });

    if (!testPaymentHistory) {
      throw new Error('Failed to create test payment history');
    }

    await PaymentHistory.findByIdAndDelete(testPaymentHistory._id);
    await Subscription.findByIdAndDelete(testSubscription._id);
    await User.findByIdAndDelete(testUser._id);

    return NextResponse.json({
      success: true,
      message: 'Supabase models working correctly',
      counts: {
        users: userCount,
        subscriptions: subscriptionCount,
        paymentHistory: paymentHistoryCount,
      },
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
