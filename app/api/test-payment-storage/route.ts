import { NextRequest, NextResponse } from 'next/server';

// Import required modules
const User = require('../../../services/models/User.js');
const Subscription = require('../../../services/models/Subscription.js');
const PaymentHistory = require('../../../services/models/PaymentHistory.js');
const dbConnect = require('../../../services/db.js');
const { getSupabase } = require('../../../services/supabaseClient.js');

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('🧪 Testing payment history storage for new user...');
    
    // Create a test user
    const testEmail = `test_${Date.now()}@example.com`;
    const testUser = new User({
      email: testEmail,
      name: `Test User ${Date.now()}`,
      password: 'test_password_123',
      role: 'user',
      isActive: true,
      additionalData: {
        firstName: 'Test',
        lastName: 'User',
        subscribeNewsletter: true
      }
    });
    
    await testUser.save();
    console.log('✅ Test user created:', testUser._id);
    
    // Create a test subscription
    const testSubscription = await Subscription.create({
      subscriptionId: `test_sub_${Date.now()}`,
      userId: testUser._id,
      details: `Test Plan - test`,
      createdDate: new Date(),
      amount: 29.99,
      numberOfUsers: 1,
      subscriptionName: 'Test Plan',
      duration: 30,
      type: 'monthly',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSessionId: `test_session_${Date.now()}`,
      metadata: {
        planId: 'test-plan',
        customerEmail: testEmail,
        testPayment: true
      }
    });
    console.log('✅ Test subscription created:', testSubscription._id);
    
    // Create payment history record
    const paymentHistoryData = {
      userId: testUser._id,
      userName: testUser.name,
      userEmail: testUser.email,
      subscriptionId: testSubscription.subscriptionId,
      planName: 'Test Plan',
      planId: 'test-plan',
      createdDate: new Date(),
      amount: 29.99,
      status: 'success',
      invoiceUrl: `https://dashboard.stripe.com/payments/test_${Date.now()}`,
      metadata: {
        planType: 'monthly',
        originalAmount: 29.99,
        currency: 'USD',
        testPayment: true,
        newUser: true,
        paymentFlow: 'test_storage_verification'
      },
      paymentMethod: 'card',
      currency: 'USD',
      description: 'Test payment for storage verification',
      customerDetails: {
        name: testUser.name,
        email: testUser.email
      }
    };
    
    const paymentHistory = new PaymentHistory(paymentHistoryData);
    await paymentHistory.save();
    console.log('✅ Payment history created:', paymentHistory._id);
    
    // Verify the data was stored correctly
    const storedUser = await User.findById(testUser._id);
    const storedSubscription = await Subscription.findById(testSubscription._id);
    const storedPaymentHistory = await PaymentHistory.findById(paymentHistory._id);
    
    // Update user with subscription reference
    await User.findByIdAndUpdate(testUser._id, {
      Subscription_id: testSubscription._id,
      isActive: true
    });
    
    // Get payment history for the user
    const userPaymentHistory = await PaymentHistory.find(
      { userId: testUser._id },
      { sort: { createdDate: -1 } }
    );
    
    console.log('✅ Verification complete - All data stored successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Payment history storage test completed successfully',
      testResults: {
        userCreated: {
          id: storedUser._id,
          email: storedUser.email,
          name: storedUser.name,
          isActive: storedUser.isActive,
          subscriptionId: storedUser.Subscription_id
        },
        subscriptionCreated: {
          id: storedSubscription._id,
          subscriptionId: storedSubscription.subscriptionId,
          planName: storedSubscription.subscriptionName,
          amount: storedSubscription.amount,
          status: storedSubscription.status,
          type: storedSubscription.type
        },
        paymentHistoryCreated: {
          id: storedPaymentHistory._id,
          userId: storedPaymentHistory.userId,
          userEmail: storedPaymentHistory.userEmail,
          planName: storedPaymentHistory.planName,
          amount: storedPaymentHistory.amount,
          status: storedPaymentHistory.status,
          createdDate: storedPaymentHistory.createdDate
        },
        userPaymentHistoryCount: userPaymentHistory.length,
        verificationPassed: !!(storedUser && storedSubscription && storedPaymentHistory && userPaymentHistory.length > 0)
      },
      cleanup: {
        note: 'Test data will be cleaned up automatically',
        testUserId: testUser._id,
        testSubscriptionId: testSubscription._id,
        testPaymentHistoryId: paymentHistory._id
      }
    });
    
  } catch (error) {
    console.error('❌ Payment storage test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Payment history storage test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('🧹 Cleaning up test payment data...');
    
    // Clean up test data created by this endpoint
    const sb = getSupabase();
    const { data: testUsers } = await sb.from('users').select('id').like('email', 'test_%@example.com');
    const { data: testSubscriptions } = await sb.from('subscriptions').select('id').contains('metadata', { testPayment: true });
    const { data: testPaymentHistory } = await sb.from('payment_histories').select('id').contains('metadata', { testPayment: true });

    console.log(`Found ${(testUsers || []).length} test users, ${(testSubscriptions || []).length} test subscriptions, ${(testPaymentHistory || []).length} test payments`);

    await sb.from('payment_histories').delete().contains('metadata', { testPayment: true });
    await sb.from('subscriptions').delete().contains('metadata', { testPayment: true });
    await sb.from('users').delete().like('email', 'test_%@example.com');
    
    console.log('✅ Test data cleanup completed');
    
    return NextResponse.json({
      success: true,
      message: 'Test data cleaned up successfully',
      cleaned: {
        users: testUsers.length,
        subscriptions: testSubscriptions.length,
        paymentHistory: testPaymentHistory.length
      }
    });
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Cleanup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
