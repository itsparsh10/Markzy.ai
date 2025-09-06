const mongoose = require('mongoose');
const User = require('../services/models/User.js');
const dbConnect = require('../services/db.js');

/**
 * Migration script to add externalUserId field to existing users
 * This is a one-time script to update your existing database
 */
async function migrateExistingUsers() {
  try {
    await dbConnect();
    
    console.log('Starting user migration to add externalUserId field...');
    
    // Find all users without externalUserId
    const usersWithoutExternalId = await User.find({ 
      $or: [
        { externalUserId: { $exists: false } },
        { externalUserId: null }
      ]
    });
    
    console.log(`Found ${usersWithoutExternalId.length} users without external ID`);
    
    // For now, we'll just log them. In a real scenario, you'd need to 
    // determine how to map existing users to external IDs
    for (const user of usersWithoutExternalId) {
      console.log(`User without external ID: ${user.email} (MongoDB ID: ${user._id})`);
      
      // You could update them with a placeholder or get the mapping from somewhere
      // Example: await User.findByIdAndUpdate(user._id, { externalUserId: someValue });
    }
    
    console.log('Migration completed. Note: externalUserId values need to be set based on your mapping logic.');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    // Close connection
    mongoose.connection.close();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateExistingUsers();
}

module.exports = { migrateExistingUsers };
