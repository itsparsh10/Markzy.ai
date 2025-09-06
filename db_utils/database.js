const mongoose = require('mongoose');
const dbConnect = require('../services/db.js');

// Import all models
const User = require('../services/models/User.js');
const Subscription = require('../services/models/Subscription.js');
const ToolHistory = require('../services/models/ToolHistory.js');
const PaymentHistory = require('../services/models/PaymentHistory.js');
const UserAnalytics = require('../services/models/UserAnalytics.js');
const Login = require('../services/models/login.js');
const Register = require('../services/models/register.js');

// Database models export
const models = {
  User,
  Subscription,
  ToolHistory,
  PaymentHistory,
  UserAnalytics,
  Login,
  Register
};

// Database connection status
const getConnectionStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Database statistics
const getDatabaseStats = async () => {
  try {
    await dbConnect();
    
    const stats = {};
    const collections = ['users', 'subscriptions', 'toolhistories', 'paymenthistories', 'useranalytics'];
    
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        stats[collection] = count;
      } catch (error) {
        stats[collection] = 0;
      }
    }
    
    return {
      connection: getConnectionStatus(),
      collections: stats
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
};

// Database health check
const healthCheck = async () => {
  try {
    await dbConnect();
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', message: 'Database is connected and responsive' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

// Export the connection function
module.exports = {
  models,
  dbConnect,
  getConnectionStatus,
  getDatabaseStats,
  healthCheck
}; 