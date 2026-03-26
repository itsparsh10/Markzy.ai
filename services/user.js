const User = require('./models/User.js');
const dbConnect = require('./db.js');
const jwt = require('jsonwebtoken');

// Safely import Subscription model with error handling
let Subscription = null;
try {
  Subscription = require('./models/Subscription.js');
} catch (error) {
  console.warn('Subscription model not available:', error.message);
}

// Get user profile from token
async function getUserProfile(token) {
  try {
    await dbConnect();

    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 10) {
      throw new Error('Invalid token format');
    }

    console.log('Attempting to verify token...');

    // First try to decode the token without verification to get the payload
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (jwtError) {
      // If JWT verification fails, try to decode without verification (for external tokens)
      console.log('JWT verification failed, trying to decode payload directly...');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        decoded = payload;
        console.log('Token decoded successfully:', decoded);
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        throw new Error('Invalid token format');
      }
    }

    console.log('Token decoded, payload:', decoded);

    let user = null;

    // Try to find user by different methods
    if (decoded.userId) {
      // This is a regular JWT token with MongoDB user ID
      console.log('Looking for user by MongoDB ID:', decoded.userId);
      user = await User.findById(decoded.userId);
    } else if (decoded.user_id) {
      // This is an external API token with external user ID
      console.log('Looking for user by external ID:', decoded.user_id);
      user = await User.findOne({ externalUserId: decoded.user_id });

      if (!user) {
        console.log('User not found by external ID, creating new user...');
        // Create a new user if not found
        user = await User.create({
          name: `User ${decoded.user_id}`,
          email: `user_${decoded.user_id}@temp.com`,
          password: 'temp_password_' + Math.random().toString(36).substring(7),
          role: 'user',
          isActive: true,
          externalUserId: decoded.user_id,
          additionalData: {
            firstName: `User`,
            lastName: `${decoded.user_id}`,
            subscribeNewsletter: true
          }
        });
        console.log('Created new user for external ID:', decoded.user_id);
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User found:', user.email);

    // Get subscription if exists
    let subscription = null;

    // First try to get subscription by user's Subscription_id
    if (user.Subscription_id && Subscription) {
      console.log(`User ${user.email} has Subscription_id: ${user.Subscription_id}`);
      try {
        const subscriptionDoc = await Subscription.findById(user.Subscription_id);
        if (subscriptionDoc && subscriptionDoc.status === 'active') {
          console.log(`Found active subscription by ID for user ${user.email}:`, subscriptionDoc.subscriptionName);
          subscription = {
            id: subscriptionDoc._id,
            subscriptionName: subscriptionDoc.subscriptionName,
            name: subscriptionDoc.subscriptionName, // For backward compatibility
            type: subscriptionDoc.type,
            amount: subscriptionDoc.amount,
            duration: subscriptionDoc.duration,
            details: subscriptionDoc.details,
            status: subscriptionDoc.status,
            createdAt: subscriptionDoc.createdAt
          };
        } else {
          console.log(`No active subscription found by ID for user ${user.email}`);
        }
      } catch (error) {
        console.error('Error fetching subscription by ID:', error);
      }
    } else {
      console.log(`User ${user.email} has no Subscription_id`);
    }

    // If no subscription found by ID, try to find by userId
    if (!subscription && Subscription) {
      console.log(`Trying to find subscription by userId for user ${user.email}`);
      try {
        const subscriptionDoc = await Subscription.findOneActiveByUser(user._id);

        if (subscriptionDoc) {
          console.log(`Found active subscription by userId for user ${user.email}:`, subscriptionDoc.subscriptionName);
          subscription = {
            id: subscriptionDoc._id,
            subscriptionName: subscriptionDoc.subscriptionName,
            name: subscriptionDoc.subscriptionName, // For backward compatibility
            type: subscriptionDoc.type,
            amount: subscriptionDoc.amount,
            duration: subscriptionDoc.duration,
            details: subscriptionDoc.details,
            status: subscriptionDoc.status,
            createdAt: subscriptionDoc.createdAt
          };

          // Update user's Subscription_id if it's not set
          if (!user.Subscription_id) {
            console.log(`Updating user ${user.email} with Subscription_id: ${subscriptionDoc._id}`);
            await User.findByIdAndUpdate(user._id, {
              Subscription_id: subscriptionDoc._id
            });
          }
        } else {
          console.log(`No active subscription found by userId for user ${user.email}`);
        }
      } catch (error) {
        console.error('Error fetching subscription by userId:', error);
      }
    }

    console.log(`Final subscription for user ${user.email}:`, subscription ? subscription.subscriptionName : 'None');

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      additionalData: user.additionalData,
      subscription: subscription
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Update user profile
async function updateUserProfile(token, updateData) {
  try {
    await dbConnect();

    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 10) {
      throw new Error('Invalid token format');
    }

    console.log('Attempting to verify token for profile update...');

    // First try to decode the token without verification to get the payload
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (jwtError) {
      // If JWT verification fails, try to decode without verification (for external tokens)
      console.log('JWT verification failed, trying to decode payload directly...');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        decoded = payload;
        console.log('Token decoded successfully:', decoded);
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        throw new Error('Invalid token format');
      }
    }

    console.log('Token decoded, payload:', decoded);

    let user = null;

    // Try to find user by different methods
    if (decoded.userId) {
      // This is a regular JWT token with MongoDB user ID
      console.log('Looking for user by MongoDB ID:', decoded.userId);
      user = await User.findById(decoded.userId);
    } else if (decoded.user_id) {
      // This is an external API token with external user ID
      console.log('Looking for user by external ID:', decoded.user_id);
      user = await User.findOne({ externalUserId: decoded.user_id });
    }

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User found for update:', user.email);

    // Prepare update object
    const updateObject = {};

    // Update basic fields if provided
    if (updateData.firstName || updateData.lastName) {
      const firstName = updateData.firstName || user.additionalData?.firstName || '';
      const lastName = updateData.lastName || user.additionalData?.lastName || '';
      updateObject.name = `${firstName} ${lastName}`.trim();
    }

    if (updateData.email) {
      updateObject.email = updateData.email;
    }

    // Update additionalData
    if (!user.additionalData) {
      user.additionalData = {};
    }

    if (updateData.firstName !== undefined) {
      user.additionalData.firstName = updateData.firstName;
    }

    if (updateData.lastName !== undefined) {
      user.additionalData.lastName = updateData.lastName;
    }

    if (updateData.companyName !== undefined) {
      user.additionalData.companyName = updateData.companyName;
    }

    if (updateData.jobTitle !== undefined) {
      user.additionalData.jobTitle = updateData.jobTitle;
    }

    if (updateData.website !== undefined) {
      user.additionalData.website = updateData.website;
    }

    updateObject.additionalData = user.additionalData;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id, // Use user._id instead of decoded.userId
      updateObject,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    console.log('User updated successfully:', updatedUser.email);

    // Get subscription if exists
    let subscription = null;

    // First try to get subscription by user's Subscription_id
    if (updatedUser.Subscription_id && Subscription) {
      console.log(`User ${updatedUser.email} has Subscription_id: ${updatedUser.Subscription_id}`);
      try {
        const subscriptionDoc = await Subscription.findById(updatedUser.Subscription_id);
        if (subscriptionDoc && subscriptionDoc.status === 'active') {
          console.log(`Found active subscription by ID for user ${updatedUser.email}:`, subscriptionDoc.subscriptionName);
          subscription = {
            id: subscriptionDoc._id,
            subscriptionName: subscriptionDoc.subscriptionName,
            name: subscriptionDoc.subscriptionName, // For backward compatibility
            type: subscriptionDoc.type,
            amount: subscriptionDoc.amount,
            duration: subscriptionDoc.duration,
            details: subscriptionDoc.details,
            status: subscriptionDoc.status
          };
        } else {
          console.log(`No active subscription found by ID for user ${updatedUser.email}`);
        }
      } catch (error) {
        console.error('Error fetching subscription by ID:', error);
      }
    } else {
      console.log(`User ${updatedUser.email} has no Subscription_id`);
    }

    // If no subscription found by ID, try to find by userId
    if (!subscription && Subscription) {
      console.log(`Trying to find subscription by userId for user ${updatedUser.email}`);
      try {
        const subscriptionDoc = await Subscription.findOne({
          userId: updatedUser._id,
          status: 'active'
        }).sort({ createdAt: -1 });

        if (subscriptionDoc) {
          console.log(`Found active subscription by userId for user ${updatedUser.email}:`, subscriptionDoc.subscriptionName);
          subscription = {
            id: subscriptionDoc._id,
            subscriptionName: subscriptionDoc.subscriptionName,
            name: subscriptionDoc.subscriptionName, // For backward compatibility
            type: subscriptionDoc.type,
            amount: subscriptionDoc.amount,
            duration: subscriptionDoc.duration,
            details: subscriptionDoc.details,
            status: subscriptionDoc.status
          };

          // Update user's Subscription_id if it's not set
          if (!updatedUser.Subscription_id) {
            console.log(`Updating user ${updatedUser.email} with Subscription_id: ${subscriptionDoc._id}`);
            await User.findByIdAndUpdate(updatedUser._id, {
              Subscription_id: subscriptionDoc._id
            });
          }
        } else {
          console.log(`No active subscription found by userId for user ${updatedUser.email}`);
        }
      } catch (error) {
        console.error('Error fetching subscription by userId:', error);
      }
    }

    console.log(`Final subscription for user ${updatedUser.email}:`, subscription ? subscription.subscriptionName : 'None');

    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      additionalData: updatedUser.additionalData,
      subscription: subscription
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Get user's brands
async function getUserBrands(userId) {
  try {
    await dbConnect();

    // For now, return mock data since we don't have a Brand model
    // In a real app, you would fetch from Brand collection
    return [
      {
        _id: 'brand-1',
        name: 'Code n Creative',
        industry: 'Tech Services',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        products: 1,
        contentPieces: 0,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  } catch (error) {
    console.error('Error getting user brands:', error);
    throw error;
  }
}

// Get user's products
async function getUserProducts(userId) {
  try {
    await dbConnect();

    // For now, return mock data since we don't have a Product model
    return [
      {
        _id: 'product-1',
        name: 'AI Services',
        brandId: 'brand-1',
        brandName: 'Code n Creative',
        description: 'AI-powered development services',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];
  } catch (error) {
    console.error('Error getting user products:', error);
    throw error;
  }
}

// Get user's content pieces
async function getUserContent(userId) {
  try {
    await dbConnect();

    // For now, return empty array since we don't have a Content model
    return [];
  } catch (error) {
    console.error('Error getting user content:', error);
    throw error;
  }
}

// Get user's recent activities
async function getUserActivities(userId) {
  try {
    await dbConnect();

    // For now, return mock activities
    return [
      {
        _id: 'activity-1',
        action: 'AI Services product created',
        description: 'You created a new product under Code n Creative brand',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'product'
      },
      {
        _id: 'activity-2',
        action: 'Brand setup completed',
        description: 'You completed the initial setup for Code n Creative',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'brand'
      },
      {
        _id: 'activity-3',
        action: 'Account created',
        description: 'Welcome to Markzy!',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'account'
      }
    ];
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw error;
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBrands,
  getUserProducts,
  getUserContent,
  getUserActivities
};
