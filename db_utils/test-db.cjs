const { config } = require('dotenv');
const path = require('path');
const { fileURLToPath } = require('url');

// Load environment variables
config();

async function testDatabaseConnection() {
  console.log('🧪 Testing MongoDB Connection...\n');
  
  try {
    // Import the database utilities
    const { getDatabaseStats, healthCheck } = require('./database.js');
    const { MONGODB_CONFIG } = require('../services/config.js');
    
    // Test health check
    console.log('1️⃣ Testing database health...');
    const health = await healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Message: ${health.message}\n`);
    
    // Get database stats
    console.log('2️⃣ Getting database statistics...');
    const stats = await getDatabaseStats();
    
    console.log('   📊 Connection Status:');
    console.log(`      Connected: ${stats.connection.isConnected ? '✅ Yes' : '❌ No'}`);
    console.log(`      Host: ${stats.connection.host}`);
    console.log(`      Port: ${stats.connection.port}`);
    console.log(`      Database: ${stats.connection.name}\n`);
    
    console.log('   📈 Collection Statistics:');
    Object.entries(stats.collections).forEach(([collection, count]) => {
      console.log(`      ${collection}: ${count} documents`);
    });
    
    console.log('\n🎉 Database connection test completed successfully!');
    
    // Show MongoDB Compass connection details
    console.log('\n📊 MongoDB Compass Connection Details:');
    console.log('=====================================');
    console.log(`Connection String: ${MONGODB_CONFIG.URI}`);
    console.log('\nTo connect in MongoDB Compass:');
    console.log('1. Open MongoDB Compass');
    console.log('2. Click "New Connection"');
    console.log('3. Paste the connection string above');
    console.log('4. Click "Connect"');
    console.log('\n📋 Available Collections:');
    console.log('   - users');
    console.log('   - subscriptions');
    console.log('   - toolhistories');
    console.log('   - paymenthistories');
    console.log('   - useranalytics');
    console.log('   - logins');
    console.log('   - registers');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check if the connection string is correct');
    console.log('3. Verify that port 27017 is available');
    console.log('4. Try running: brew services start mongodb-community');
  }
}

// Run the test
testDatabaseConnection(); 