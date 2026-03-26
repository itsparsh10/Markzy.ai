const User = require('./models/User.js');
const Subscription = require('./models/Subscription.js');
const dbConnect = require('./db.js');

async function verifyPaymentWithServer(sessionId, planId, planName) {
  try {
    await dbConnect();

    const subscription = await Subscription.findOne({ subscriptionId: sessionId });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const user = await User.findById(subscription.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const subscriptionDate = new Date(subscription.createdAt);

    let remainingDays = 0;
    let isActive = false;

    if (subscription.type === 'lifetime') {
      remainingDays = -1;
      isActive = subscription.status === 'active';
    } else {
      const daysSinceSubscription = Math.floor((now - subscriptionDate) / (1000 * 60 * 60 * 24));
      remainingDays = Math.max(0, 30 - daysSinceSubscription);
      isActive = remainingDays > 0 && subscription.status === 'active';
    }

    return {
      sessionId,
      planId,
      planName,
      isActive,
      remainingDays,
      subscriptionDate: subscription.createdAt,
      amount: subscription.amount,
      status: isActive ? 'active' : 'expired',
    };
  } catch (error) {
    console.error('Error verifying payment with server:', error);
    throw error;
  }
}

async function getUserMembershipStatus(userId) {
  try {
    await dbConnect();

    const subscription = await Subscription.findOneActiveByUser(userId);

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        planName: null,
        remainingDays: 0,
        isActive: false,
      };
    }

    const now = new Date();
    const subscriptionDate = new Date(subscription.createdAt);

    let remainingDays = 0;
    let isActive = false;

    if (subscription.type === 'lifetime') {
      remainingDays = -1;
      isActive = subscription.status === 'active';
    } else {
      const daysSinceSubscription = Math.floor(
        (now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
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
      status: subscription.status,
    };
  } catch (error) {
    console.error('Error getting user membership status:', error);
    throw error;
  }
}

async function createSubscription(userId, sessionId, planName, planId, amount, customerEmail = null) {
  try {
    await dbConnect();

    let user = await User.findById(userId);
    if (!user) {
      console.log(`User not found for ID: ${userId}, creating new user`);
      user = await createNewUserForSubscription(userId, planName, customerEmail);
    }

    const planNameLower = planName.toLowerCase();
    console.log('Creating subscription with:', { planName, planId, planNameLower, customerEmail });

    let isLifetime = false;
    let isMonthly = false;

    if (planId === 'lifetime') {
      isLifetime = true;
    } else if (planId === 'small-business' || planId === 'entrepreneur') {
      isMonthly = true;
    } else {
      isLifetime = planNameLower.includes('lifetime') || planNameLower.includes('one-time');

      isMonthly =
        planNameLower.includes('monthly') ||
        planNameLower.includes('small business') ||
        planNameLower.includes('entrepreneur');
    }

    if (!isLifetime && !isMonthly) {
      isMonthly = true;
    }

    console.log('Plan type detection:', {
      planId,
      planName,
      isLifetime,
      isMonthly,
      finalType: isLifetime ? 'lifetime' : 'monthly',
    });

    const subscriptionData = {
      subscriptionId: sessionId,
      userId: user._id,
      amount: amount,
      currency: 'USD',
      subscriptionName: planName,
      type: isLifetime ? 'lifetime' : 'monthly',
      duration: isLifetime ? -1 : 30,
      status: 'active',
      createdAt: new Date(),
      expiresAt: isLifetime ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSessionId: sessionId,
      metadata: {
        planId: planId,
        customerEmail: customerEmail || user?.email || 'unknown@email.com',
        userCreated: false,
      },
      details: `Plan: ${planName} - Amount: $${amount}`,
      numberOfUsers: 1,
      createdDate: new Date(),
    };

    const subscription = await Subscription.create(subscriptionData);
    console.log(`Created subscription: ${subscription._id}`);

    await User.findByIdAndUpdate(userId, {
      Subscription_id: subscription._id,
      isActive: true,
    });
    console.log(`Updated user ${userId} with subscription ID: ${subscription._id}`);

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

async function createNewUserForSubscription(userId, planName, customerEmail = null) {
  try {
    const email = customerEmail || `user_${userId}@temp.com`;
    const name = `User ${userId}`;

    console.log(`Creating new user for subscription: ID=${userId}, Email=${email}, Plan=${planName}`);

    const newUser = await User.create({
      email: email.toLowerCase(),
      name: name,
      password: 'temp_password_' + Math.random().toString(36).substring(7),
      role: 'user',
      isActive: true,
      additionalData: {
        firstName: `User`,
        lastName: `${userId}`,
        subscribeNewsletter: true,
      },
      _id: userId,
      id: userId,
    });

    console.log(`Created new user for subscription: ${newUser._id} with email: ${email}`);

    return newUser;
  } catch (error) {
    console.error('Error creating new user for subscription:', error);
    return null;
  }
}

module.exports = {
  verifyPaymentWithServer,
  getUserMembershipStatus,
  createSubscription,
};
