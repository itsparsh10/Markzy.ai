const User = require('./models/User.js');
const dbConnect = require('./db.js');

/**
 * Find or create user mapping between external API user ID and MongoDB user
 * @param {number} externalUserId - User ID from external API
 * @param {string} email - User email
 * @param {object} userData - Additional user data
 * @returns {object} MongoDB User document
 */
async function findOrCreateUserMapping(externalUserId, email, userData = {}) {
  try {
    await dbConnect();
    
    // First, try to find user by external user ID
    let user = await User.findOne({ externalUserId: externalUserId });
    
    if (user) {
      console.log(`Found existing user mapping: ${user.email} -> External ID: ${externalUserId}`);
      return user;
    }
    
    // If not found by external ID, try to find by email
    user = await User.findOne({ email: email });
    
    if (user) {
      // Update existing user with external user ID
      await User.findByIdAndUpdate(user._id, { 
        externalUserId: externalUserId,
        ...userData 
      });
      console.log(`Updated existing user ${email} with external ID: ${externalUserId}`);
      return await User.findById(user._id); // Return updated user
    }
    
    // If user doesn't exist, create new one
    const newUser = await User.create({
      name: userData.name || email.split('@')[0], // Use email prefix as default name
      email: email,
      password: userData.password || 'default-password', // You should handle this properly
      externalUserId: externalUserId,
      isActive: true,
      ...userData
    });
    
    console.log(`Created new user mapping: ${email} -> External ID: ${externalUserId}`);
    return newUser;
    
  } catch (error) {
    console.error('Error in findOrCreateUserMapping:', error);
    throw error;
  }
}

/**
 * Find user by external user ID
 * @param {number} externalUserId - User ID from external API
 * @returns {Promise<any|null>} MongoDB User document or null
 */
async function findUserByExternalId(externalUserId) {
  try {
    await dbConnect();
    const user = await User.findOne({ externalUserId: externalUserId });
    return user;
  } catch (error) {
    console.error('Error finding user by external ID:', error);
    throw error;
  }
}

/**
 * Update user's external ID mapping
 * @param {string} mongoUserId - MongoDB user ID
 * @param {number} externalUserId - External API user ID
 * @returns {Promise<any>} Updated user document
 */
async function updateUserExternalId(mongoUserId, externalUserId) {
  try {
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(
      mongoUserId, 
      { externalUserId: externalUserId },
      { new: true }
    );
    console.log(`Updated user ${updatedUser?.email} with external ID: ${externalUserId}`);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user external ID:', error);
    throw error;
  }
}

module.exports = {
  findOrCreateUserMapping,
  findUserByExternalId,
  updateUserExternalId
};
