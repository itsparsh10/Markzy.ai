const User = require('./models/User.js');
const SessionLog = require('./models/SessionLog.js');
const UserAnalytics = require('./models/UserAnalytics.js');
const ToolHistory = require('./models/ToolHistory.js');
const Subscription = require('./models/Subscription.js');
const PaymentHistory = require('./models/PaymentHistory.js');
const dbConnect = require('./db.js');
const mongoose = require('mongoose');

// Get all registered users with their stats
async function getAllUsers() {
  try {
    await dbConnect();
    
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'useranalytics',
          localField: '_id',
          foreignField: 'userId',
          as: 'analytics'
        }
      },
      {
        $lookup: {
          from: 'toolhistories',
          localField: '_id',
          foreignField: 'userId',
          as: 'toolHistory'
        }
      },
      {
        $lookup: {
          from: 'paymenthistories',
          localField: '_id',
          foreignField: 'userId',
          as: 'payments'
        }
      },
      {
        $lookup: {
          from: 'sessionlogs',
          localField: '_id',
          foreignField: 'userId',
          as: 'sessions'
        }
      },
      {
        $addFields: {
          totalToolUsage: { $size: '$toolHistory' },
          totalPayments: { $size: '$payments' },
          totalSpent: { $sum: '$payments.amount' },
          lastToolUsage: { $max: '$toolHistory.generatedDate' },
          lastLoginAt: { $max: '$sessions.loginAt' },
          analyticsCount: { $size: '$analytics' }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          isActive: 1,
          createdAt: 1,
          totalToolUsage: 1,
          totalPayments: 1,
          totalSpent: 1,
          lastToolUsage: 1,
          lastLoginAt: 1,
          analyticsCount: 1,
          additionalData: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

// Get tool usage statistics using ToolHistory
async function getToolUsageStats() {
  try {
    await dbConnect();
    
    const toolStats = await ToolHistory.aggregate([
      {
        $group: {
          _id: '$toolName',
          usageCount: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          lastUsed: { $max: '$generatedDate' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      {
        $sort: { usageCount: -1 }
      }
    ]);

    return toolStats;
  } catch (error) {
    console.error('Error getting tool usage stats:', error);
    throw error;
  }
}

// Get user analytics data
async function getUserAnalytics() {
  try {
    await dbConnect();
    
    const analytics = await UserAnalytics.aggregate([
      {
        $group: {
          _id: '$toolName',
          totalVisits: { $sum: '$visitCount' },
          totalTimeSpent: { $sum: '$timeSpent' },
          uniqueUsers: { $addToSet: '$userId' },
          lastVisit: { $max: '$lastVisitDate' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' },
          averageTimeSpent: { $divide: ['$totalTimeSpent', '$totalVisits'] }
        }
      },
      {
        $sort: { totalVisits: -1 }
      }
    ]);

    return analytics;
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
}

// Get subscription and payment statistics
async function getSubscriptionStats() {
  try {
    await dbConnect();
    
    // Get subscription stats from Subscription collection using subscriptionName
    const subscriptionStats = await Subscription.aggregate([
      {
        $match: {
          status: 'active', // Only count active subscriptions
          subscriptionName: { $not: /test/i } // Exclude test plans
        }
      },
      {
        $group: {
          _id: '$subscriptionName', // Group by subscriptionName
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          totalUsers: { $size: '$uniqueUsers' }
        }
      },
      {
        $project: {
          _id: 1,
          planName: '$_id',
          count: 1,
          totalAmount: 1,
          totalUsers: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get payment status stats from PaymentHistory
    const paymentStats = await PaymentHistory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get total revenue from active subscriptions (excluding test plans)
    const totalRevenue = await Subscription.aggregate([
      {
        $match: {
          status: 'active',
          subscriptionName: { $not: /test/i } // Exclude test plans
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    console.log('Subscription Stats from Subscription collection (excluding test plans):', {
      subscriptionStats,
      paymentStats,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0
    });

    return {
      subscriptions: subscriptionStats,
      payments: paymentStats,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0
    };
  } catch (error) {
    console.error('Error getting subscription stats:', error);
    throw error;
  }
}

// Get active users (users with recent tool usage)
async function getActiveUsers() {
  try {
    await dbConnect();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await ToolHistory.aggregate([
      {
        $match: {
          generatedDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$userId',
          toolUsageCount: { $sum: 1 },
          lastActivity: { $max: '$generatedDate' },
          toolsUsed: { $addToSet: '$toolName' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          toolUsageCount: 1,
          lastActivity: 1,
          toolsUsed: 1
        }
      },
      {
        $sort: { lastActivity: -1 }
      }
    ]);

    return activeUsers;
  } catch (error) {
    console.error('Error getting active users:', error);
    throw error;
  }
}

// Get session analytics using SessionLog
async function getSessionAnalytics() {
  try {
    await dbConnect();
    
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const analytics = await SessionLog.aggregate([
      {
        $match: {
          loginAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$loginAt" }
          },
          dailySessions: { $sum: 1 },
          dailyDuration: { $sum: '$duration' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          dailyUniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return analytics;
  } catch (error) {
    console.error('Error getting session analytics:', error);
    throw error;
  }
}

// Get dashboard summary stats
async function getDashboardStats() {
  try {
    await dbConnect();
    
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Auto-cleanup old active sessions first
    await cleanupOldActiveSessions();
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get new users in last 30 days
    const newUsers = await User.countDocuments({
      createdAt: { $gte: last30Days }
    });
    
    // Get currently active users (logged in within last 5 minutes and haven't logged out)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const currentlyActiveUsers = await SessionLog.distinct('userId', {
      loginAt: { $gte: fiveMinutesAgo },
      $or: [
        { logoutAt: { $exists: false } },
        { isActive: true }
      ]
    });
    
    // Also check for users with very recent tool activity (last 2 minutes) as a backup
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const recentActivityUsers = await ToolHistory.distinct('userId', {
      generatedDate: { $gte: twoMinutesAgo }
    });
    
    // Combine both sets for currently active users
    const allCurrentlyActive = [...new Set([...currentlyActiveUsers, ...recentActivityUsers])];
    const activeUsersCount = allCurrentlyActive.length;
    
    // Get total active subscriptions count
    const totalActiveSubscriptions = await Subscription.countDocuments({
      status: 'active'
    });
    
    // Get total payment volume (sum of all successful payments)
    const totalPaymentVolume = await PaymentHistory.aggregate([
      {
        $match: {
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$amount' }
        }
      }
    ]);
    
    const [
      totalToolUsage,
      totalPayments,
      subscriptionStats,
      toolUsageStats
    ] = await Promise.all([
      ToolHistory.countDocuments({ generatedDate: { $gte: last30Days } }),
      PaymentHistory.countDocuments(),
      getSubscriptionStats(),
      getToolUsageStats()
    ]);

    console.log('Dashboard Stats Debug:', {
      totalUsers,
      newUsers,
      currentlyActiveUsers: currentlyActiveUsers.length,
      recentActivityUsers: recentActivityUsers.length,
      allCurrentlyActive: allCurrentlyActive.length,
      activeUsersCount,
      totalToolUsage,
      totalPayments,
      totalActiveSubscriptions,
      totalPaymentVolume: totalPaymentVolume[0]?.totalVolume || 0
    });

    return {
      totalUsers,
      newUsers,
      activeUsers: activeUsersCount,
      totalToolUsage,
      totalPayments,
      totalActiveSubscriptions,
      totalPaymentVolume: totalPaymentVolume[0]?.totalVolume || 0,
      subscriptions: subscriptionStats.subscriptions,
      payments: subscriptionStats.payments,
      topTools: toolUsageStats.slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

// Auto-cleanup old active sessions (called by getDashboardStats)
async function cleanupOldActiveSessions() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // Find and update sessions that are marked as active but haven't been updated recently
    const result = await SessionLog.updateMany(
      {
        isActive: true,
        loginAt: { $lt: tenMinutesAgo }
      },
      {
        isActive: false,
        logoutAt: new Date(),
        duration: {
          $function: {
            body: function(loginAt, logoutAt) {
              return Math.floor((logoutAt - loginAt) / 1000);
            },
            args: ['$loginAt', '$$NOW'],
            lang: 'js'
          }
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🧹 Auto-cleaned ${result.modifiedCount} old active sessions`);
    }
  } catch (error) {
    console.error('Error cleaning up old active sessions:', error);
  }
}

// Get revenue analytics
async function getRevenueAnalytics() {
  try {
    await dbConnect();
    
    const revenueStats = await PaymentHistory.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdDate" }
          },
          totalRevenue: { $sum: '$amount' },
          successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    return revenueStats;
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
}

// Get detailed user information
async function getUserDetails(userId) {
  try {
    await dbConnect();
    
    // Convert string userId to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      throw new Error('Invalid user ID format');
    }
    
    // Get basic user info with aggregated stats
    const userBasic = await User.aggregate([
      {
        $match: { _id: objectId }
      },
      {
        $lookup: {
          from: 'useranalytics',
          localField: '_id',
          foreignField: 'userId',
          as: 'analytics'
        }
      },
      {
        $lookup: {
          from: 'toolhistories',
          localField: '_id',
          foreignField: 'userId',
          as: 'toolHistory'
        }
      },
      {
        $lookup: {
          from: 'paymenthistories',
          localField: '_id',
          foreignField: 'userId',
          as: 'payments'
        }
      },
      {
        $lookup: {
          from: 'sessionlogs',
          localField: '_id',
          foreignField: 'userId',
          as: 'sessions'
        }
      },
      {
        $addFields: {
          totalToolUsage: { $size: '$toolHistory' },
          totalPayments: { $size: '$payments' },
          totalSpent: { $sum: '$payments.amount' },
          lastToolUsage: { $max: '$toolHistory.generatedDate' },
          lastLoginAt: { $max: '$sessions.loginAt' },
          analyticsCount: { $size: '$analytics' }
        }
      }
    ]);

    if (userBasic.length === 0) {
      throw new Error('User not found');
    }

    const user = userBasic[0];

    // Get subscription details
    const subscriptions = await Subscription.find({ userId: objectId })
      .sort({ createdAt: -1 })
      .lean();

    // Get payment history
    const paymentHistory = await PaymentHistory.find({ userId: objectId })
      .sort({ createdDate: -1 })
      .lean();

    // Get login history
    const loginHistory = await SessionLog.find({ userId: objectId })
      .sort({ loginAt: -1 })
      .limit(10)
      .lean();

    // Get tool usage statistics
    const toolUsage = await ToolHistory.aggregate([
      {
        $match: { userId: objectId }
      },
      {
        $group: {
          _id: '$toolName',
          usageCount: { $sum: 1 },
          lastUsed: { $max: '$generatedDate' }
        }
      },
      {
        $sort: { usageCount: -1 }
      }
    ]);

    return {
      ...user,
      subscriptions: subscriptions.map(sub => {
        const now = new Date();
        const subscriptionDate = new Date(sub.createdAt);
        
        let remainingDays = 0;
        let calculatedEndDate = null;
        
        if (sub.type === 'lifetime') {
          remainingDays = -1; // Lifetime
          calculatedEndDate = null;
        } else {
          // Monthly subscription - calculate remaining days
          const daysSinceSubscription = Math.floor((now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24));
          remainingDays = Math.max(0, 30 - daysSinceSubscription);
          calculatedEndDate = new Date(subscriptionDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        }
        
        return {
          type: sub.type,
          amount: sub.amount,
          status: sub.status,
          startDate: sub.createdAt,
          endDate: sub.expiresAt || calculatedEndDate,
          nextPaymentDate: sub.type === 'monthly' ? (sub.expiresAt || calculatedEndDate) : null,
          remainingDays: remainingDays
        };
      }),
      paymentHistory: paymentHistory.map(payment => ({
        amount: payment.amount,
        status: payment.status,
        date: payment.createdDate,
        description: payment.description || `Payment ${payment.status}`
      })),
      loginHistory: loginHistory.map(session => ({
        loginAt: session.loginAt,
        logoutAt: session.logoutAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      })),
      toolUsage: toolUsage.map(tool => ({
        toolName: tool._id,
        usageCount: tool.usageCount,
        lastUsed: tool.lastUsed
      }))
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getToolUsageStats,
  getUserAnalytics,
  getSubscriptionStats,
  getActiveUsers,
  getSessionAnalytics,
  getDashboardStats,
  getRevenueAnalytics,
  getUserDetails,
  cleanupOldActiveSessions
}; 