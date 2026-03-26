import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '../../../../services/db.js';
import UserModel from '../../../../services/models/User.js';
import Subscription from '../../../../services/models/Subscription.js';
import PaymentHistory from '../../../../services/models/PaymentHistory.js';

/** App user row (avoids collision with DOM `User` when typing model instances). */
type AppUser = {
  _id: string;
  id?: string;
  email: string;
  name?: string;
  password?: string;
  role?: string;
  Subscription_id?: string | null;
  isActive?: boolean;
  createdAt?: Date | null;
  externalUserId?: string | null;
  additionalData?: Record<string, unknown>;
};

// Initialize Stripe with the provided secret key
const stripe = new Stripe('sk_test_51RmFMN093NmKUNibyNfjQlekyYKGmPZlw7VHTInd79PtJcZopVLU0ssoZfrynZHSslEbAptKULlREgP1UJF7SxWh00udPSH2aW', {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('Webhook received - Headers:', {
      'stripe-signature': signature ? 'present' : 'missing',
      'content-type': req.headers.get('content-type'),
      'user-agent': req.headers.get('user-agent')
    });

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook signature verified successfully');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`Processing webhook event: ${event.type}`);
    console.log('Event data:', {
      id: event.id,
      type: event.type,
      created: event.created,
      data: event.data ? 'present' : 'missing'
    });

    // Prevent processing the same event multiple times
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Processing checkout session: ${session.id}`);
    }

    // Ensure database connection
    try {
      await dbConnect();
      console.log('Database connected successfully for webhook processing');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify models are available
    try {
      const userCount = await UserModel.countDocuments();
      const subscriptionCount = await Subscription.countDocuments();
      const paymentHistoryCount = await PaymentHistory.countDocuments();
      console.log(`Models verified - Users: ${userCount}, Subscriptions: ${subscriptionCount}, PaymentHistory: ${paymentHistoryCount}`);
    } catch (modelError) {
      console.error('Model verification failed:', modelError);
      return NextResponse.json(
        { error: 'Model verification failed' },
        { status: 500 }
      );
    }

    let processingResult = null;

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Processing checkout.session.completed event');
        processingResult = await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        console.log('Processing invoice.payment_succeeded event');
        processingResult = await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        console.log('Processing invoice.payment_failed event');
        processingResult = await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.deleted':
        console.log('Processing customer.subscription.deleted event');
        processingResult = await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'payment_intent.succeeded':
        console.log('Processing payment_intent.succeeded event');
        processingResult = await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        console.log('Processing payment_intent.payment_failed event');
        processingResult = await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('Webhook processing completed successfully');
    return NextResponse.json({ received: true, processed: true, result: processingResult });

  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const { planName, planId, userId, authenticatedUserId, customerEmail } = session.metadata || {};
    const customerName = session.customer_details?.name;

    console.log(`Processing completed checkout session: ${session.id}`);
    console.log(`Session metadata:`, { planName, planId, userId, authenticatedUserId, customerEmail });
    console.log(`Customer details:`, session.customer_details);

    if (!planName || !customerEmail) {
      console.error('Missing required metadata in checkout session');
      return { success: false, error: 'Missing required metadata' };
    }

    // Enhanced user lookup and creation - prioritize authenticated user
    let user: AppUser | null = await findOrCreateUserWithPriority(
      customerEmail, 
      customerName || undefined, 
      session, 
      userId || undefined, 
      authenticatedUserId || undefined
    );
    
    if (!user) {
      console.error(`Failed to find or create user for email: ${customerEmail}`);
      console.error('Session data:', {
        sessionId: session.id,
        customerEmail,
        customerName,
        userId,
        authenticatedUserId,
        metadata: session.metadata
      });
      return { success: false, error: 'Failed to find or create user' };
    }

    console.log(`Selected user for payment: ${user.email} (ID: ${user._id})`);

    // Create or update subscription
    const isLifetime = planName.toLowerCase().includes('lifetime') || planId === 'lifetime';
    const subscriptionData = {
      subscriptionId: session.id,
      userId: user._id,
      amount: (session.amount_total || 0) / 100, // Convert from cents
      currency: session.currency || 'USD',
      subscriptionName: planName,
      type: isLifetime ? 'lifetime' : 'monthly',
      duration: isLifetime ? -1 : 30, // -1 for lifetime, 30 days for monthly
      status: 'active',
      createdAt: new Date(),
      expiresAt: isLifetime ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      stripeSessionId: session.id,
      stripeCustomerId: session.customer as string,
      metadata: {
        planId: planId,
        originalAmount: session.amount_total,
        customerEmail: customerEmail,
        customerName: customerName,
        authenticatedUserId: authenticatedUserId || 'none',
        sessionUserId: userId || 'none',
        selectedUserId: user._id.toString(),
        selectionMethod: authenticatedUserId && authenticatedUserId !== 'none' ? 'authenticated_user_id' : 
                        userId && userId !== 'anonymous' && userId !== 'none' ? 'session_user_id' : 'email_lookup'
      },
      // Legacy fields for backward compatibility
      details: `Plan: ${planName} - Amount: $${(session.amount_total || 0) / 100}`,
      numberOfUsers: 1,
      createdDate: new Date()
    };

    let subscription = await Subscription.findOne({ subscriptionId: session.id });
    
    if (subscription) {
      // Update existing subscription
      try {
        await Subscription.findByIdAndUpdate(subscription._id, subscriptionData);
        console.log(`Updated existing subscription: ${subscription._id}`);
      } catch (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    } else {
      // Create new subscription
      try {
        const created = await Subscription.create(subscriptionData);
        if (!created) {
          throw new Error('Failed to create subscription');
        }
        subscription = created;
        console.log(`Created new subscription: ${subscription._id}`);
      } catch (createError) {
        console.error('Error creating subscription:', createError);
        console.error('Subscription data:', subscriptionData);
        throw createError;
      }
    }

    if (!subscription) {
      throw new Error('Subscription missing after checkout handling');
    }

    // Update user's subscription reference and status
    try {
      await UserModel.findByIdAndUpdate(user._id, {
        Subscription_id: subscription._id,
        isActive: true,
      });
      console.log(`Updated user ${user._id} with subscription ID: ${subscription._id}`);
    } catch (userUpdateError) {
      console.error('Error updating user subscription reference:', userUpdateError);
      throw userUpdateError;
    }

    // Create comprehensive payment history record
    let paymentHistory = null;
    try {
      paymentHistory = await createComprehensivePaymentHistory(user, session, planName, planId);
      console.log(`Payment history created successfully for user: ${user.email}`);
    } catch (paymentHistoryError) {
      console.error('Error creating payment history:', paymentHistoryError);
      throw paymentHistoryError;
    }

    console.log(`Successfully processed checkout session for user: ${user.email}, plan: ${planName}`);
    console.log(`Final data:`, {
      userId: user._id,
      userEmail: user.email,
      subscriptionId: subscription._id,
      planName,
      amount: (session.amount_total || 0) / 100,
      paymentHistoryId: paymentHistory?._id
    });

    return {
      success: true,
      userId: user._id,
      userEmail: user.email,
      subscriptionId: subscription._id,
      planName,
      amount: (session.amount_total || 0) / 100,
      paymentHistoryId: paymentHistory?._id
    };

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    console.error('Session data that caused error:', {
      sessionId: session.id,
      metadata: session.metadata,
      customerDetails: session.customer_details
    });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Enhanced user lookup with priority for authenticated users
async function findOrCreateUserWithPriority(
  email: string,
  name?: string,
  session?: Stripe.Checkout.Session,
  sessionUserId?: string,
  authenticatedUserId?: string
): Promise<AppUser | null> {
  try {
    console.log(`Looking for user with priority - Email: ${email}, Session User ID: ${sessionUserId}, Authenticated User ID: ${authenticatedUserId}`);
    
    // CRITICAL FIX: First priority - If we have an authenticated user ID, ALWAYS use that user
    if (authenticatedUserId && authenticatedUserId !== 'none' && authenticatedUserId !== 'anonymous') {
      console.log(`Priority 1: Looking for authenticated user by ID: ${authenticatedUserId}`);
      let authenticatedUser = await UserModel.findById(authenticatedUserId);
      if (authenticatedUser) {
        console.log(`✅ Found authenticated user: ${authenticatedUser.email} (ID: ${authenticatedUser._id})`);
        return authenticatedUser as AppUser;
      } else {
        console.log(`❌ Authenticated user ID ${authenticatedUserId} not found in database, creating new user with this ID`);
        // ALWAYS create new user with the authenticated user ID - don't fall back to email lookup
        return await createNewUserWithId(email, name, authenticatedUserId, session);
      }
    }
    
    // Second priority: If we have a session user ID and it's not anonymous, try to find that specific user
    if (sessionUserId && sessionUserId !== 'anonymous' && sessionUserId !== 'none') {
      console.log(`Priority 2: Looking for session user by ID: ${sessionUserId}`);
      let sessionUser = await UserModel.findById(sessionUserId);
      if (sessionUser) {
        console.log(`✅ Found session user: ${sessionUser.email} (ID: ${sessionUser._id})`);
        return sessionUser as AppUser;
      } else {
        console.log(`❌ Session user ID ${sessionUserId} not found in database, creating new user with this ID`);
        // Create new user with the session user ID - don't fall back to email lookup
        return await createNewUserWithId(email, name, sessionUserId, session);
      }
    }
    
    // Third priority: Only use email-based lookup if we don't have any user IDs at all
    console.log(`Priority 3: No valid user IDs provided, using email-based lookup for: ${email}`);
    
    // Try to find by exact email match
    let user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (user) {
      console.log(`✅ Found existing user by exact email match: ${user.email} (ID: ${user._id})`);
      return user as AppUser;
    }
    
    // If no user found, create a new user (without specific ID)
    console.log(`❌ No existing user found for email: ${email}, creating new user`);
    return await createNewUserWithId(email, name, undefined, session);
  } catch (error) {
    console.error('Error finding or creating user with priority:', error);
    return null;
  }
}

// Helper function to create a new user with specific ID
async function createNewUserWithId(
  email: string,
  name?: string,
  userId?: string,
  session?: Stripe.Checkout.Session
): Promise<AppUser | null> {
  try {
    // Extract name from session or use provided name
    let userName = name;
    if (!userName && session?.customer_details?.name) {
      userName = session.customer_details.name;
    }
    if (!userName) {
      userName = email.split('@')[0]; // Use email prefix as name
    }

    // Create new user with specific ID if provided
    const userData: any = {
      email: email.toLowerCase(),
      name: userName,
      password: 'temp_password_' + Math.random().toString(36).substring(7), // Temporary password
      role: 'user',
      isActive: true,
      additionalData: {
        firstName: userName.split(' ')[0] || '',
        lastName: userName.split(' ').slice(1).join(' ') || '',
        subscribeNewsletter: true
      }
    };

    // If we have a specific user ID, use it
    if (userId && userId !== 'anonymous' && userId !== 'none') {
      userData._id = userId;
      console.log(`Creating new user with specific ID: ${userId} and email: ${email}`);
    } else {
      console.log(`Creating new user with email: ${email} (no specific ID)`);
    }

    // Check if user with this email already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists: ${existingUser._id}`);
      
      // If we have a specific user ID that doesn't match existing user, this could be a problem
      if (userId && userId !== 'anonymous' && userId !== 'none' && existingUser._id.toString() !== userId) {
        console.log(`⚠️  Email ${email} belongs to user ${existingUser._id} but requested user ID is ${userId}`);
        console.log(`Using existing user ${existingUser._id} instead of creating duplicate`);
      }
      
      return existingUser as AppUser;
    }

    const newUser = new UserModel(userData);
    await newUser.save();
    console.log(`Created new user: ${newUser._id} for email: ${email}`);
    
    return newUser as unknown as AppUser;
  } catch (error) {
    console.error('Error creating new user with ID:', error);
    
    // If there's an error creating with specific ID, try creating without ID
    if (userId && userId !== 'anonymous' && userId !== 'none') {
      console.log(`Retrying user creation without specific ID for email: ${email}`);
      try {
        const userData: any = {
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          password: 'temp_password_' + Math.random().toString(36).substring(7),
          role: 'user',
          isActive: true,
          additionalData: {
            firstName: (name || email.split('@')[0]).split(' ')[0] || '',
            lastName: (name || email.split('@')[0]).split(' ').slice(1).join(' ') || '',
            subscribeNewsletter: true
          }
        };

        const newUser = new UserModel(userData);
        await newUser.save();
        console.log(`Created new user without specific ID: ${newUser._id} for email: ${email}`);
        return newUser as unknown as AppUser;
      } catch (retryError) {
        console.error('Error creating user without specific ID:', retryError);
        return null;
      }
    }
    
    return null;
  }
}

// Enhanced user lookup function (for existing users only)
async function findUserByEmail(email: string): Promise<AppUser | null> {
  try {
    // First try to find by exact email match
    let user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (user) {
      console.log(`Found user by exact email match: ${user.email}`);
      return user as AppUser;
    }
    
    // Try case-insensitive search
    user = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    if (user) {
      console.log(`Found user by case-insensitive email match: ${user.email}`);
      return user as AppUser;
    }
    
    // Try to find by partial email match (for cases where email might be slightly different)
    const emailDomain = email.split('@')[1];
    if (emailDomain) {
      user = await UserModel.findOne({ 
        email: { $regex: new RegExp(`@${emailDomain}$`, 'i') }
      });
      
      if (user) {
        console.log(`Found user by domain match: ${user.email}`);
        return user as AppUser;
      }
    }
    
    console.log(`No user found for email: ${email}`);
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

// Enhanced payment history creation
async function createComprehensivePaymentHistory(user: any, session: Stripe.Checkout.Session, planName: string, planId: string) {
  try {
    console.log(`Creating payment history for user: ${user.email} (ID: ${user._id})`);
    console.log(`Session ID: ${session.id}, Plan: ${planName} (${planId})`);
    
    // Check if payment history already exists for this session with more robust checking
    const existingPayment = await PaymentHistory.findOne({ 
      subscriptionId: session.id,
      userId: user._id,
      amount: (session.amount_total || 0) / 100
    });
    
    if (existingPayment) {
      console.log(`Payment history already exists for session: ${session.id}, user: ${user._id}, amount: ${(session.amount_total || 0) / 100}`);
      return existingPayment;
    }

    const { authenticatedUserId, sessionUserId } = session.metadata || {};
    const selectionMethod = authenticatedUserId && authenticatedUserId !== 'none' && authenticatedUserId !== 'anonymous' ? 'authenticated_user_id' : 
                           sessionUserId && sessionUserId !== 'anonymous' && sessionUserId !== 'none' ? 'session_user_id' : 'email_lookup';

    console.log(`Creating payment history with selection method: ${selectionMethod}`);
    console.log(`Payment user verification: User ID: ${user._id}, Authenticated ID: ${authenticatedUserId}, Session ID: ${sessionUserId}`);

    // Create comprehensive payment history entry
    const paymentHistoryData = {
      userId: user._id,
      userName: user.name || 'Unknown User',
      userEmail: user.email,
      subscriptionId: session.id,
      planName: planName,
      planId: planId,
      createdDate: new Date(),
      amount: (session.amount_total || 0) / 100, // Convert from cents
      status: 'success',
      invoiceUrl: `https://dashboard.stripe.com/payments/${session.id}`,
      metadata: {
        planType: planId === 'lifetime' ? 'lifetime' : 'monthly',
        originalAmount: session.amount_total,
        currency: session.currency || 'USD',
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        paymentMethod: session.payment_method_types?.[0] || 'card',
        stripeCustomerId: session.customer,
        sessionId: session.id,
        userCreated: user.createdAt === user.updatedAt, // Indicates if user was just created
        authenticatedUserId: authenticatedUserId || 'none',
        sessionUserId: sessionUserId || 'none',
        selectedUserId: user._id.toString(),
        selectionMethod: selectionMethod,
        customerDetails: {
          name: session.customer_details?.name,
          email: session.customer_details?.email,
          address: session.customer_details?.address
        }
      },
      // Additional fields for better tracking
      paymentMethod: session.payment_method_types?.[0] || 'card',
      currency: session.currency || 'USD',
      description: `Payment for ${planName} subscription`,
      customerDetails: {
        name: session.customer_details?.name,
        email: session.customer_details?.email,
        address: session.customer_details?.address
      }
    };
    
    console.log('Payment history data:', {
      userId: paymentHistoryData.userId,
      userEmail: paymentHistoryData.userEmail,
      subscriptionId: paymentHistoryData.subscriptionId,
      planName: paymentHistoryData.planName,
      amount: paymentHistoryData.amount,
      status: paymentHistoryData.status
    });
    
    try {
      const paymentHistory = new PaymentHistory(paymentHistoryData);
      await paymentHistory.save();
      
      console.log(`Comprehensive payment history saved: ${paymentHistory._id} for user: ${user.email} (ID: ${user._id})`);
      console.log(`Selection method: ${selectionMethod}`);
      
      return paymentHistory;
    } catch (saveError: any) {
      // Handle duplicate key error (E11000)
      if (saveError.code === 11000) {
        console.log(`Duplicate payment history detected for session: ${session.id}, user: ${user._id}`);
        // Try to find the existing payment history
        const existingPayment = await PaymentHistory.findOne({ 
          subscriptionId: session.id,
          userId: user._id,
          amount: (session.amount_total || 0) / 100
        });
        if (existingPayment) {
          console.log(`Returning existing payment history: ${existingPayment._id}`);
          return existingPayment;
        }
      }
      throw saveError;
    }
  } catch (error) {
    console.error('Error creating comprehensive payment history:', error);
    console.error('User data:', {
      userId: user._id,
      userEmail: user.email,
      userName: user.name
    });
    console.error('Session data:', {
      sessionId: session.id,
      planName,
      planId,
      amount: (session.amount_total || 0) / 100
    });
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Get customer email from customer object or subscription
    let customerEmail: string | null = null;
    
    if (typeof invoice.customer === 'string') {
      // Customer ID - need to fetch customer details
      try {
        const customer = await stripe.customers.retrieve(invoice.customer) as Stripe.Customer;
        customerEmail = customer.email;
      } catch (error) {
        console.error('Error fetching customer for invoice:', error);
      }
    } else if (invoice.customer && typeof invoice.customer === 'object' && !invoice.customer.deleted) {
      // Customer object (not deleted)
      customerEmail = (invoice.customer as Stripe.Customer).email;
    }
    
    if (!customerEmail) {
      console.log('No customer email found in invoice');
      return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Update user status to active
    await UserModel.findByIdAndUpdate(user._id, { isActive: true });
    
    console.log(`Payment succeeded for user: ${customerEmail}`);

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Get customer email from customer object or subscription
    let customerEmail: string | null = null;
    
    if (typeof invoice.customer === 'string') {
      // Customer ID - need to fetch customer details
      try {
        const customer = await stripe.customers.retrieve(invoice.customer) as Stripe.Customer;
        customerEmail = customer.email;
      } catch (error) {
        console.error('Error fetching customer for invoice:', error);
      }
    } else if (invoice.customer && typeof invoice.customer === 'object' && !invoice.customer.deleted) {
      // Customer object (not deleted)
      customerEmail = (invoice.customer as Stripe.Customer).email;
    }
    
    if (!customerEmail) {
      console.log('No customer email found in invoice');
      return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Update user status to inactive
    await UserModel.findByIdAndUpdate(user._id, { isActive: false });
    
    console.log(`Payment failed for user: ${customerEmail}`);

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Get customer email from customer object
    let customerEmail: string | null = null;
    
    if (typeof subscription.customer === 'string') {
      // Customer ID - need to fetch customer details
      try {
        const customer = await stripe.customers.retrieve(subscription.customer) as Stripe.Customer;
        customerEmail = customer.email;
      } catch (error) {
        console.error('Error fetching customer for subscription:', error);
      }
    } else if (subscription.customer && typeof subscription.customer === 'object' && !subscription.customer.deleted) {
      // Customer object (not deleted)
      customerEmail = (subscription.customer as Stripe.Customer).email;
    }
    
    if (!customerEmail) {
      console.log('No customer email found in subscription');
      return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Update subscription status to cancelled
    await Subscription.findOneAndUpdate(
      { stripeCustomerId: subscription.customer },
      { status: 'cancelled' }
    );

    // Update user status to inactive
    await UserModel.findByIdAndUpdate(user._id, { isActive: false });
    
    console.log(`Subscription cancelled for user: ${customerEmail}`);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Get customer email from customer object
    let customerEmail: string | null = null;
    
    if (typeof paymentIntent.customer === 'string') {
      // Customer ID - need to fetch customer details
      try {
        const customer = await stripe.customers.retrieve(paymentIntent.customer) as Stripe.Customer;
        customerEmail = customer.email;
      } catch (error) {
        console.error('Error fetching customer for payment intent:', error);
      }
    } else if (paymentIntent.customer && typeof paymentIntent.customer === 'object' && !paymentIntent.customer.deleted) {
      // Customer object (not deleted)
      customerEmail = (paymentIntent.customer as Stripe.Customer).email;
    }
    
    if (!customerEmail) {
      console.log('No customer email found in payment intent');
      return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Update user status to active
    await UserModel.findByIdAndUpdate(user._id, { isActive: true });
    
    console.log(`Payment intent succeeded for user: ${customerEmail}`);

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Get customer email from customer object
    let customerEmail: string | null = null;
    
    if (typeof paymentIntent.customer === 'string') {
      // Customer ID - need to fetch customer details
      try {
        const customer = await stripe.customers.retrieve(paymentIntent.customer) as Stripe.Customer;
        customerEmail = customer.email;
      } catch (error) {
        console.error('Error fetching customer for payment intent:', error);
      }
    } else if (paymentIntent.customer && typeof paymentIntent.customer === 'object' && !paymentIntent.customer.deleted) {
      // Customer object (not deleted)
      customerEmail = (paymentIntent.customer as Stripe.Customer).email;
    }
    
    if (!customerEmail) {
      console.log('No customer email found in payment intent');
      return;
    }

    const user = await findUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Update user status to inactive
    await UserModel.findByIdAndUpdate(user._id, { isActive: false });
    
    console.log(`Payment intent failed for user: ${customerEmail}`);

  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

function getSubscriptionType(planName: string): 'monthly' | 'lifetime' {
  const planNameLower = planName.toLowerCase();
  
  if (planNameLower.includes('lifetime') || planNameLower.includes('one-time')) {
    return 'lifetime';
  }
  
  return 'monthly';
} 