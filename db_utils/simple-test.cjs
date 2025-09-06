const mongoose = require('mongoose');
const { config } = require('dotenv');

// Load environment variables
config();

const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

async function testDatabaseConnection() {
  console.log('🧪 Testing MongoDB Connection...\n');
  console.log('📊 Database URI:', MONGODB_CONFIG.URI);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.URI, MONGODB_CONFIG.OPTIONS);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database health
    console.log('\n1️⃣ Testing database health...');
    await mongoose.connection.db.admin().ping();
    console.log('   Status: ✅ Healthy');
    console.log('   Message: Database is connected and responsive\n');
    
    // Get connection status
    console.log('2️⃣ Connection Status:');
    console.log(`   Connected: ${mongoose.connection.readyState === 1 ? '✅ Yes' : '❌ No'}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Database: ${mongoose.connection.name}\n`);
    
    // Get collection statistics
    console.log('3️⃣ Collection Statistics:');
    const collections = ['users', 'subscriptions', 'toolhistories', 'paymenthistories', 'useranalytics'];
    
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        console.log(`   ${collection}: ${count} documents`);
      } catch (error) {
        console.log(`   ${collection}: 0 documents (collection may not exist yet)`);
      }
    }
    
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
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check if the connection string is correct');
    console.log('3. Verify that port 27017 is available');
    console.log('4. Try running: brew services start mongodb-community');
    console.log('5. Or install MongoDB if not installed');
  }
}

// Run the test
testDatabaseConnection(); 