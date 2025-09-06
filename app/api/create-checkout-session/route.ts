import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Initialize Stripe with the provided secret key
const stripe = new Stripe('sk_test_51RmFMN093NmKUNibyNfjQlekyYKGmPZlw7VHTInd79PtJcZopVLU0ssoZfrynZHSslEbAptKULlREgP1UJF7SxWh00udPSH2aW', {
  apiVersion: '2025-08-27.basil',
});

interface CheckoutRequest {
  planName: string;
  description?: string;
  amount: number;
  origin: string;
  planId?: string;
  userId?: string;
  customerEmail?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();

    // Validate required fields
    if (!body.planName || !body.amount || !body.origin) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'planName, amount, and origin are required' 
        },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amount = parseFloat(body.amount.toString());
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { 
          error: 'Invalid amount', 
          details: 'Amount must be a positive number' 
        },
        { status: 400 }
      );
    }

    // Validate origin URL
    try {
      new URL(body.origin);
    } catch {
      return NextResponse.json(
        { 
          error: 'Invalid origin URL', 
          details: 'Please provide a valid URL' 
        },
        { status: 400 }
      );
    }

    // Get current authenticated user from token
    let currentUserId = null;
    let currentUserEmail = null;
    
    try {
      // Get token from headers
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        
        // Verify token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        currentUserId = decoded.userId;
        currentUserEmail = decoded.email;
        
        console.log(`Authenticated user from token: ${currentUserId}, email: ${currentUserEmail}`);
      }
    } catch (error) {
      console.log('No valid authentication token found, using provided user data');
    }

    // CRITICAL FIX: For authenticated users, ONLY use authenticated data, never fall back to localStorage data
    let userId, customerEmail;
    
    if (currentUserId && currentUserEmail) {
      // User is authenticated - use ONLY authenticated data
      userId = currentUserId;
      customerEmail = currentUserEmail;
      console.log('Using AUTHENTICATED user data only');
    } else {
      // No authentication - use provided data as fallback
      userId = body.userId || 'anonymous';
      customerEmail = body.customerEmail;
      console.log('No authentication found, using provided data');
    }

    console.log(`Creating checkout session for user: ${userId}, email: ${customerEmail}`);
    console.log(`User identification:`, {
      hasAuthenticatedUser: !!currentUserId,
      authenticatedUserId: currentUserId,
      authenticatedUserEmail: currentUserEmail,
      providedUserId: body.userId,
      providedEmail: body.customerEmail,
      finalUserId: userId,
      finalEmail: customerEmail
    });

    // Create checkout session with enhanced configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.planName,
              description: body.description || `Upgrade to ${body.planName} plan`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      success_url: `${body.origin}${body.planId === 'lifetime' ? '/lifetime-success' : '/success'}?session_id={CHECKOUT_SESSION_ID}&plan_name=${encodeURIComponent(body.planName)}&plan_id=${encodeURIComponent(body.planId || body.planName.toLowerCase().replace(/\s+/g, '-'))}&amount=${amount}`,
      cancel_url: `${body.origin}/cancel`,
      metadata: {
        planName: body.planName,
        planId: body.planId || body.planName.toLowerCase().replace(/\s+/g, '-'),
        userId: userId,
        authenticatedUserId: currentUserId || 'none', // Track if user was authenticated
        amount: amount.toString(),
        timestamp: new Date().toISOString(),
        customerEmail: customerEmail || 'unknown',
      },
      customer_email: customerEmail,
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: {
          planName: body.planName,
          planId: body.planId || body.planName.toLowerCase().replace(/\s+/g, '-'),
          userId: userId,
          authenticatedUserId: currentUserId || 'none',
          customerEmail: customerEmail || 'unknown',
        },
      },
      // Add custom branding
      custom_text: {
        submit: {
          message: 'You will be charged immediately for your subscription.',
        },
      },
    });

    console.log(`Checkout session created: ${session.id} for plan: ${body.planName}, user: ${userId}, authenticated user: ${currentUserId}`);

    return NextResponse.json({ 
      success: true,
      sessionId: session.id,
      url: session.url,
      amount: amount,
      planName: body.planName,
    });

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          error: 'Payment processing error',
          details: error.message,
          code: error.code 
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'Failed to create checkout session' 
      },
      { status: 500 }
    );
  }
}
