import mongoose from 'mongoose';
import { MONGODB_CONFIG } from '../config.js';

// Import all models to ensure they are registered
import './User.js';
import './Subscription.js';
import './ToolHistory.js';
import './PaymentHistory.js';
import './UserAnalytics.js';
import './login.js';
import './register.js';
import './FormQuery.js';

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📊 Database URI:', MONGODB_CONFIG.URI);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.URI, MONGODB_CONFIG.OPTIONS);
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📋 Available collections:');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Create indexes for better performance
    console.log('🔧 Creating database indexes...');
    
    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ role: 1 });
    
    // ToolHistory indexes
    await mongoose.connection.db.collection('toolhistories').createIndex({ userId: 1 });
    await mongoose.connection.db.collection('toolhistories').createIndex({ toolName: 1 });
    await mongoose.connection.db.collection('toolhistories').createIndex({ generatedDate: -1 });
    
    // PaymentHistory indexes
    await mongoose.connection.db.collection('paymenthistories').createIndex({ userId: 1 });
    await mongoose.connection.db.collection('paymenthistories').createIndex({ status: 1 });
    await mongoose.connection.db.collection('paymenthistories').createIndex({ createdDate: -1 });
    
    // UserAnalytics indexes
    await mongoose.connection.db.collection('useranalytics').createIndex({ userId: 1 });
    await mongoose.connection.db.collection('useranalytics').createIndex({ toolName: 1 });
    await mongoose.connection.db.collection('useranalytics').createIndex({ lastVisitDate: -1 });
    
    // Subscription indexes
    await mongoose.connection.db.collection('subscriptions').createIndex({ subscriptionId: 1 }, { unique: true });
    await mongoose.connection.db.collection('subscriptions').createIndex({ type: 1 });
    
    console.log('✅ Database indexes created successfully!');
    console.log('🎉 Database initialization complete!');
    console.log('\n📊 You can now connect to MongoDB Compass using:');
    console.log(`   ${MONGODB_CONFIG.URI}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('🚀 Database ready for use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to initialize database:', error);
      process.exit(1);
    });
}

export default initializeDatabase; 