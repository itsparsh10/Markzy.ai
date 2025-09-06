const mongoose = require('mongoose');
const { config } = require('dotenv');

// Load environment variables
config();

const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/markzy',
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// Define schemas directly to avoid ES module import issues
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  Subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: { type: String, required: true },
  details: { type: String },
  createdDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  numberOfUsers: { type: Number, required: true },
  subscriptionName: { type: String, required: true },
  duration: { type: Number, required: true },
  type: { type: String, enum: ['premium', 'standard', 'enterprise'], required: true },
});

const toolHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toolName: String,
  toolId: String,
  outputResult: String,
  generatedDate: { type: Date, default: Date.now },
});

const paymentHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  userEmail: { type: String },
  subscriptionId: { type: String },
  createdDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], required: true },
  invoiceUrl: { type: String },
});

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  toolName: { type: String, required: true },
  lastVisitDate: { type: Date, required: true },
  visitCount: { type: Number, default: 1 },
  timeSpent: { type: Number, default: 0 },
});

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📊 Database URI:', MONGODB_CONFIG.URI);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.URI, MONGODB_CONFIG.OPTIONS);
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Register models
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
    const ToolHistory = mongoose.models.ToolHistory || mongoose.model('ToolHistory', toolHistorySchema);
    const PaymentHistory = mongoose.models.PaymentHistory || mongoose.model('PaymentHistory', paymentHistorySchema);
    const UserAnalytics = mongoose.models.UserAnalytics || mongoose.model('UserAnalytics', userAnalyticsSchema);
    
    console.log('📋 Registered models:');
    console.log('  - User');
    console.log('  - Subscription');
    console.log('  - ToolHistory');
    console.log('  - PaymentHistory');
    console.log('  - UserAnalytics');
    
    // List all collections
    console.log('\n📋 Available collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Create indexes for better performance
    console.log('\n🔧 Creating database indexes...');
    
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
if (require.main === module) {
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

module.exports = initializeDatabase; 