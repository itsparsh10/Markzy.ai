import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentWithServer, createSubscription } from './../../../services/paymentService.js';
import { tokenManager } from '../../../services/tokenManager.js';
import { findUserByExternalId, updateUserExternalId } from '../../../services/userMappingService.js';
import { getUserProfile } from '../../../services/user.js';

// Import required modules for payment history
const User = require('../../../services/models/User.js');
const PaymentHistory = require('../../../services/models/PaymentHistory.js');
const dbConnect = require('../../../services/db.js');

// Helper function to decode JWT token and extract user ID
function decodeToken(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Helper function to fetch current user data from profile API
async function fetchCurrentUserData(token: string): Promise<any> {
  try {
    console.log('Fetching current user data from profile API...');
    const userProfile = await getUserProfile(token);
    console.log('Current user data fetched:', {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name
    });
    return userProfile;
  } catch (error) {
    console.error('Error fetching current user data:', error);
    return null;
  }
}

// Helper function to identify user from token
async function identifyUserFromToken(token: string): Promise<any> {
  try {
    const tokenPayload = decodeToken(token);
    if (!tokenPayload) {
      return null;
    }

    console.log('Token payload:', tokenPayload);

    // Check if this is a regular JWT token (has userId) or external API token (has user_id)
    if (tokenPayload.userId) {
      // This is a regular JWT token from our system
      console.log('Regular JWT token detected, userId:', tokenPayload.userId);

      // Find user by MongoDB ObjectId
      const user = await User.findById(tokenPayload.userId);
      if (user) {
        console.log('Found user by MongoDB ID:', user.email);
        return user;
      }
    } else if (tokenPayload.user_id) {
      // This is an external API token
      console.log('External API token detected, user_id:', tokenPayload.user_id);

      // Find user by external ID
      let user = await findUserByExternalId(tokenPayload.user_id);
      if (!user) {
        // If user not found by external ID, try to create one
        console.log('User not found with external ID, creating new user for external ID:', tokenPayload.user_id);
        user = await createNewUserForPayment(tokenPayload.user_id, 'Lifetime', 'lifetime', `user_${tokenPayload.user_id}@temp.com`, `User ${tokenPayload.user_id}`);
      }

      if (user) {
        console.log('Found/Created user by external ID:', user.email);
        return user;
      }
    }

    console.log('No user found for token');
    return null;
  } catch (error) {
    console.error('Error identifying user from token:', error);
    return null;
  }
}

// Helper function to verify payment history was stored in MongoDB
async function verifyPaymentHistoryStored(userId: string, sessionId: string): Promise<boolean> {
  try {
    console.log('🔍 Verifying payment history was stored in MongoDB...');

    // Check if payment history exists in MongoDB
    const paymentHistory = await PaymentHistory.findOne({
      userId: userId,
      subscriptionId: sessionId
    });

    if (paymentHistory) {
      console.log('✅ Payment history verified in MongoDB:', {
        paymentId: paymentHistory._id,
        userId: paymentHistory.userId,
        userEmail: paymentHistory.userEmail,
        amount: paymentHistory.amount,
        status: paymentHistory.status
      });
      return true;
    } else {
      console.error('❌ Payment history not found in MongoDB for user:', userId, 'session:', sessionId);
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying payment history in MongoDB:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, planId, planName, amount, userEmail, userName, externalUserId } = await request.json();

    console.log('🔄 Verify payment request:', { sessionId, planId, planName, amount, userEmail, userName, externalUserId });

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get user ID from request body, headers, or token manager
    let userIdToUse = externalUserId;
    let currentUserToken = null;
    let identifiedUser = null;

    if (!userIdToUse) {
      // Try to get token from Authorization header
      const authHeader = request.headers.get('authorization');
      let token = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        currentUserToken = token; // Store for later use
        console.log('Using token from Authorization header');
      } else {
        // Fallback to token manager
        token = tokenManager.getToken();
        currentUserToken = token; // Store for later use
        console.log('Using token from token manager');
      }

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      // Identify user from token
      await dbConnect();
      identifiedUser = await identifyUserFromToken(token);

      if (!identifiedUser) {
        return NextResponse.json(
          { success: false, message: 'User not found for the provided token' },
          { status: 401 }
        );
      }

      console.log('Identified user from token:', identifiedUser.email);
    }

    // If we have an identified user, use it directly
    let user = identifiedUser;

    if (!user && userIdToUse) {
      // Fallback to external user ID logic
      console.log('Looking for user with external ID:', userIdToUse);

      // Use the mapping service to find user by external ID
      user = await findUserByExternalId(userIdToUse);

      if (!user) {
        // If no user found with external ID, try to find by email if provided
        if (userEmail) {
          console.log('Looking for user by email:', userEmail);
          user = await User.findOne({ email: userEmail });

          if (user && !user.externalUserId) {
            // Update the user with the external user ID for future requests
            user = await updateUserExternalId(user._id, userIdToUse);
            console.log('Updated existing user with external ID:', userIdToUse);
          }
        }
      }

      if (!user) {
        // If still no user found, create a new user with provided data
        console.log('No user found, creating new user for external ID:', userIdToUse);
        user = await createNewUserForPayment(userIdToUse, planName, planId, userEmail, userName);
      }
    }

    // If we still don't have a user, try to extract from the token or create one
    if (!user && currentUserToken) {
      const tokenPayload = decodeToken(currentUserToken);
      if (tokenPayload && tokenPayload.user_id) {
        console.log('Creating user from token payload, user_id:', tokenPayload.user_id);
        user = await createNewUserForPayment(tokenPayload.user_id, planName, planId, `user_${tokenPayload.user_id}@temp.com`, `User ${tokenPayload.user_id}`);
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Failed to create or find user' },
        { status: 404 }
      );
    }

    console.log(`Found/Created user: ${user.email} (MongoDB ID: ${user._id}, External ID: ${user.externalUserId})`);
    const userId = user._id; // Use MongoDB ObjectId

    // Fetch current user data from profile API to ensure we have the most up-to-date information
    let currentUserData = null;
    if (currentUserToken) {
      currentUserData = await fetchCurrentUserData(currentUserToken);
    }

    // Use current user data if available, otherwise fall back to user data from database
    const finalUserData = currentUserData || user;
    console.log('Using user data for payment:', {
      id: finalUserData.id || finalUserData._id,
      email: finalUserData.email,
      name: finalUserData.name
    });

    try {
      // Try to verify existing payment
      const paymentStatus = await verifyPaymentWithServer(sessionId, planId, planName);

      // Ensure payment history exists even for verified payments
      await ensurePaymentHistoryExists(userId, sessionId, planName, planId, amount || 0, finalUserData);

      // Verify payment history was stored in MongoDB
      const historyStored = await verifyPaymentHistoryStored(userId, sessionId);

      console.log('✅ Payment verification completed successfully');

      return NextResponse.json({
        success: true,
        data: paymentStatus,
        paymentHistoryStored: historyStored
      });
    } catch (error: any) {
      // If subscription not found, create it
      if (error.message === 'Subscription not found') {
        console.log('📝 Creating new subscription for session:', sessionId);

        // Use user's email as customer email
        const customerEmail = finalUserData.email || userEmail || null;
        console.log('Creating subscription with customer email:', customerEmail);

        try {
          // Create subscription first
          const subscription = await createSubscription(userId, sessionId, planName, planId, amount || 0, customerEmail);
          console.log('✅ Subscription created successfully:', subscription._id);

          // CRITICAL: Always create payment history in MongoDB
          console.log('💾 Creating payment history in MongoDB for new subscription');
          const paymentHistory = await createPaymentHistory(userId, sessionId, planName, planId, amount || 0, finalUserData);
          console.log('✅ Payment history created in MongoDB:', paymentHistory._id);

          // Verify payment history was stored
          const historyStored = await verifyPaymentHistoryStored(userId, sessionId);

          // Return the created subscription status
          const paymentStatus = {
            sessionId,
            planId,
            planName,
            isActive: true,
            remainingDays: subscription.type === 'lifetime' ? -1 : 30,
            subscriptionDate: subscription.createdAt,
            amount: subscription.amount,
            status: 'active'
          };

          console.log('✅ New subscription and payment history created successfully for user:', finalUserData.email);

          return NextResponse.json({
            success: true,
            data: paymentStatus,
            paymentHistoryStored: historyStored,
            paymentHistoryId: paymentHistory._id
          });
        } catch (subscriptionError) {
          console.error('❌ Error creating subscription:', subscriptionError);

          // Even if subscription creation fails, try to create payment history
          let paymentHistoryId = null;
          try {
            console.log('🔄 Attempting to create payment history despite subscription error');
            const paymentHistory = await createPaymentHistory(userId, sessionId, planName, planId, amount || 0, finalUserData);
            console.log('✅ Payment history created despite subscription error:', paymentHistory._id);
            paymentHistoryId = paymentHistory._id;
          } catch (historyError) {
            console.error('❌ Failed to create payment history:', historyError);
          }

          // Verify payment history was stored
          const historyStored = await verifyPaymentHistoryStored(userId, sessionId);

          return NextResponse.json({
            success: false,
            message: 'Subscription creation failed but payment history was created',
            paymentHistoryStored: historyStored,
            paymentHistoryId: paymentHistoryId
          });
        }
      }

      throw error;
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// Helper function to create new user for payment
async function createNewUserForPayment(externalUserId: number, planName: string, planId: string, userEmail?: string, userName?: string) {
  try {
    console.log(`Creating new user for payment with external ID: ${externalUserId}, email: ${userEmail}, name: ${userName}`);

    // Generate email if not provided
    const email = userEmail || `user_${externalUserId}@temp.com`;
    const name = userName || `User ${externalUserId}`;

    // Create a new user with proper information
    const newUser = new User({
      email: email,
      name: name,
      password: 'temp_password_' + Math.random().toString(36).substring(7), // Temporary password
      role: 'user',
      isActive: true,
      externalUserId: externalUserId,
      additionalData: {
        firstName: name.split(' ')[0] || 'User',
        lastName: name.split(' ').slice(1).join(' ') || `${externalUserId}`,
        subscribeNewsletter: true
      }
    });

    await newUser.save();
    console.log(`Created new user for payment: ${newUser._id} with external ID: ${externalUserId}, email: ${email}`);

    return newUser;
  } catch (error) {
    console.error('Error creating new user for payment:', error);
    return null;
  }
}

// Helper function to ensure payment history exists
async function ensurePaymentHistoryExists(userId: string, sessionId: string, planName: string, planId: string, amount: number, user: any) {
  try {
    console.log('🔍 Checking if payment history exists for session:', sessionId);

    // Check if payment history already exists for this session
    const existingPayment = await PaymentHistory.findOne({ subscriptionId: sessionId });

    if (!existingPayment) {
      console.log('📝 Creating payment history for existing subscription:', sessionId);
      const result = await createPaymentHistory(userId, sessionId, planName, planId, amount, user);
      console.log('✅ Payment history created successfully:', result._id);
    } else {
      console.log('ℹ️ Payment history already exists for session:', sessionId);
    }
  } catch (error) {
    console.error('❌ Error ensuring payment history exists:', error);
    // Don't fail the payment if history saving fails
  }
}

// Helper function to create payment history
async function createPaymentHistory(userId: string, sessionId: string, planName: string, planId: string, amount: number, user: any) {
  try {
    console.log('🔄 Creating payment history with user data:', {
      userId,
      sessionId,
      planName,
      planId,
      amount,
      userEmail: user.email,
      userName: user.name,
      userCreated: user.createdAt === user.updatedAt,
      userMongoId: user._id,
      userExternalId: user.externalUserId
    });

    // Get user details from database to ensure we have the latest data
    const userDetails = await User.findById(userId);
    console.log('📊 User details from database:', {
      found: !!userDetails,
      email: userDetails?.email,
      name: userDetails?.name,
      externalUserId: userDetails?.externalUserId
    });

    // Use the most up-to-date user information
    const finalUserName = user.name || userDetails?.name || 'Unknown User';
    const finalUserEmail = user.email || userDetails?.email || 'unknown@email.com';

    console.log('✅ Final user data for payment history:', {
      finalUserName,
      finalUserEmail,
      userId,
      userMongoId: user._id,
      userExternalId: user.externalUserId
    });

    // Create payment history entry with all required fields
    const paymentHistoryData = {
      userId: userId,
      userName: finalUserName,
      userEmail: finalUserEmail,
      subscriptionId: sessionId,
      planName: planName,
      planId: planId,
      createdDate: new Date(),
      amount: amount,
      status: 'success',
      invoiceUrl: `https://dashboard.stripe.com/payments/${sessionId}`,
      metadata: {
        planType: planId === 'lifetime' ? 'lifetime' : 'monthly',
        originalAmount: amount,
        currency: 'USD',
        userCreated: user.createdAt === user.updatedAt, // Indicates if user was just created
        verifiedByToken: true, // Indicates this was verified by token
        externalUserId: user.externalUserId || null,
        selectionMethod: 'verify_payment_endpoint',
        newUser: user.createdAt === user.updatedAt, // Indicates this is a new user
        fetchedFromProfile: !!user.id, // Indicates if data was fetched from profile API
        tokenType: user.externalUserId ? 'external_api' : 'regular_jwt', // Track token type used
        storedInMongoDB: true // Indicates this was stored in MongoDB
      },
      paymentMethod: 'card',
      currency: 'USD',
      description: `Payment for ${planName} subscription`,
      customerDetails: {
        name: finalUserName,
        email: finalUserEmail
      }
    };

    console.log('💾 Payment history data to save in MongoDB:', {
      userId: paymentHistoryData.userId,
      userEmail: paymentHistoryData.userEmail,
      userName: paymentHistoryData.userName,
      subscriptionId: paymentHistoryData.subscriptionId,
      planName: paymentHistoryData.planName,
      amount: paymentHistoryData.amount,
      status: paymentHistoryData.status,
      newUser: paymentHistoryData.metadata.newUser,
      fetchedFromProfile: paymentHistoryData.metadata.fetchedFromProfile,
      tokenType: paymentHistoryData.metadata.tokenType,
      storedInMongoDB: paymentHistoryData.metadata.storedInMongoDB
    });

    // CRITICAL: Save to MongoDB
    const paymentHistory = new PaymentHistory(paymentHistoryData);
    const savedPayment = await paymentHistory.save();

    console.log('✅ Payment history saved successfully in MongoDB:', {
      paymentHistoryId: savedPayment._id,
      userId: savedPayment.userId,
      userEmail: savedPayment.userEmail,
      userName: savedPayment.userName,
      storedInMongoDB: true
    });

    // Verify the payment was actually saved
    const verifyPayment = await PaymentHistory.findById(savedPayment._id);
    if (verifyPayment) {
      console.log('✅ Payment history verified in MongoDB:', verifyPayment._id);
    } else {
      console.error('❌ Payment history not found in MongoDB after save!');
    }

    return savedPayment;
  } catch (error) {
    console.error('❌ Error saving payment history in MongoDB:', error);
    console.error('Payment history data that failed:', {
      userId,
      sessionId,
      planName,
      planId,
      amount,
      userEmail: user?.email,
      userName: user?.name,
      userCreated: user?.createdAt === user?.updatedAt,
      userMongoId: user?._id,
      userExternalId: user?.externalUserId
    });
    throw error;
  }
}