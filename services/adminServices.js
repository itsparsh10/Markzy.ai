const User = require('./models/User.js');
const SessionLog = require('./models/SessionLog.js');
const UserAnalytics = require('./models/UserAnalytics.js');
const ToolHistory = require('./models/ToolHistory.js');
const Subscription = require('./models/Subscription.js');
const PaymentHistory = require('./models/PaymentHistory.js');
const dbConnect = require('./db.js');
const { getSupabase } = require('./supabaseClient');

async function getAllUsers() {
  try {
    await dbConnect();
    const sb = getSupabase();
    const { data: users, error: uErr } = await sb.from('users').select('*').order('created_at', { ascending: false });
    if (uErr) throw uErr;

    const [{ data: th }, { data: ph }, { data: sl }, { data: ua }] = await Promise.all([
      sb.from('tool_histories').select('user_id, generated_date'),
      sb.from('payment_histories').select('user_id, amount'),
      sb.from('session_logs').select('user_id, login_at'),
      sb.from('user_analytics').select('user_id'),
    ]);

    const toolCount = {};
    const lastTool = {};
    (th || []).forEach((r) => {
      const id = r.user_id;
      toolCount[id] = (toolCount[id] || 0) + 1;
      const d = new Date(r.generated_date);
      if (!lastTool[id] || d > lastTool[id]) lastTool[id] = d;
    });

    const payCount = {};
    const totalSpent = {};
    (ph || []).forEach((r) => {
      const id = r.user_id;
      payCount[id] = (payCount[id] || 0) + 1;
      totalSpent[id] = (totalSpent[id] || 0) + (Number(r.amount) || 0);
    });

    const lastLogin = {};
    (sl || []).forEach((r) => {
      const id = r.user_id;
      const d = new Date(r.login_at);
      if (!lastLogin[id] || d > lastLogin[id]) lastLogin[id] = d;
    });

    const analyticsCount = {};
    (ua || []).forEach((r) => {
      const id = r.user_id;
      analyticsCount[id] = (analyticsCount[id] || 0) + 1;
    });

    return (users || []).map((row) => ({
      _id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at,
      additionalData: row.additional_data || {},
      totalToolUsage: toolCount[row.id] || 0,
      totalPayments: payCount[row.id] || 0,
      totalSpent: totalSpent[row.id] || 0,
      lastToolUsage: lastTool[row.id] || null,
      lastLoginAt: lastLogin[row.id] || null,
      analyticsCount: analyticsCount[row.id] || 0,
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

async function getToolUsageStats() {
  try {
    await dbConnect();
    const sb = getSupabase();
    const { data, error } = await sb.from('tool_histories').select('tool_name, user_id, generated_date');
    if (error) throw error;
    const map = {};
    (data || []).forEach((r) => {
      const k = r.tool_name || 'unknown';
      if (!map[k]) {
        map[k] = { _id: k, toolName: k, usageCount: 0, uniqueUsers: new Set(), lastUsed: null };
      }
      map[k].usageCount += 1;
      map[k].uniqueUsers.add(String(r.user_id));
      const d = new Date(r.generated_date);
      if (!map[k].lastUsed || d > map[k].lastUsed) map[k].lastUsed = d;
    });
    return Object.values(map)
      .map((m) => ({
        _id: m._id,
        toolName: m.toolName,
        usageCount: m.usageCount,
        uniqueUserCount: m.uniqueUsers.size,
        lastUsed: m.lastUsed,
      }))
      .sort((a, b) => b.usageCount - a.usageCount);
  } catch (error) {
    console.error('Error getting tool usage stats:', error);
    throw error;
  }
}

async function getUserAnalytics() {
  try {
    await dbConnect();
    return UserAnalytics.aggregate([
      { $group: { _id: '$toolName', totalVisits: { $sum: '$visitCount' } } },
    ]);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
}

async function getSubscriptionStats() {
  try {
    await dbConnect();
    const sb = getSupabase();
    const { data: subs, error: sErr } = await sb
      .from('subscriptions')
      .select('subscription_name, amount, user_id, status')
      .eq('status', 'active');
    if (sErr) throw sErr;

    const subscriptionStatsMap = {};
    (subs || []).forEach((r) => {
      const name = r.subscription_name || 'unknown';
      if (/test/i.test(name)) return;
      if (!subscriptionStatsMap[name]) {
        subscriptionStatsMap[name] = {
          _id: name,
          planName: name,
          count: 0,
          totalAmount: 0,
          uniqueUsers: new Set(),
        };
      }
      subscriptionStatsMap[name].count += 1;
      subscriptionStatsMap[name].totalAmount += Number(r.amount) || 0;
      subscriptionStatsMap[name].uniqueUsers.add(String(r.user_id));
    });

    const subscriptionStats = Object.values(subscriptionStatsMap).map((s) => ({
      _id: s._id,
      planName: s.planName,
      count: s.count,
      totalAmount: s.totalAmount,
      totalUsers: s.uniqueUsers.size,
    }));

    const paymentStats = await PaymentHistory.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
    ]);

    const { data: revRows } = await sb
      .from('subscriptions')
      .select('amount, subscription_name, status')
      .eq('status', 'active');
    let totalRevenue = 0;
    (revRows || []).forEach((r) => {
      if (!/test/i.test(r.subscription_name || '')) totalRevenue += Number(r.amount) || 0;
    });

    return {
      subscriptions: subscriptionStats,
      payments: paymentStats,
      totalRevenue,
    };
  } catch (error) {
    console.error('Error getting subscription stats:', error);
    throw error;
  }
}

async function getActiveUsers() {
  try {
    await dbConnect();
    const sb = getSupabase();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: rows, error } = await sb
      .from('tool_histories')
      .select('user_id, tool_name, generated_date')
      .gte('generated_date', thirtyDaysAgo.toISOString());
    if (error) throw error;

    const byUser = {};
    (rows || []).forEach((r) => {
      const id = r.user_id;
      if (!byUser[id]) {
        byUser[id] = {
          _id: id,
          toolUsageCount: 0,
          lastActivity: null,
          toolsUsed: new Set(),
        };
      }
      byUser[id].toolUsageCount += 1;
      byUser[id].toolsUsed.add(r.tool_name);
      const d = new Date(r.generated_date);
      if (!byUser[id].lastActivity || d > byUser[id].lastActivity) byUser[id].lastActivity = d;
    });

    const ids = Object.keys(byUser);
    const { data: users } = await sb.from('users').select('id, name, email').in('id', ids);

    const userMap = {};
    (users || []).forEach((u) => {
      userMap[u.id] = u;
    });

    return ids.map((id) => ({
      _id: id,
      name: userMap[id]?.name,
      email: userMap[id]?.email,
      toolUsageCount: byUser[id].toolUsageCount,
      lastActivity: byUser[id].lastActivity,
      toolsUsed: [...byUser[id].toolsUsed],
    })).sort((a, b) => (b.lastActivity > a.lastActivity ? 1 : -1));
  } catch (error) {
    console.error('Error getting active users:', error);
    throw error;
  }
}

async function getSessionAnalytics() {
  try {
    await dbConnect();
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return SessionLog.aggregate([
      { $match: { loginAt: { $gte: last30Days } } },
    ]);
  } catch (error) {
    console.error('Error getting session analytics:', error);
    throw error;
  }
}

async function getDashboardStats() {
  try {
    await dbConnect();
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    await cleanupOldActiveSessions();

    const sb = getSupabase();

    const { count: totalUsers } = await sb.from('users').select('*', { count: 'exact', head: true });

    const { count: newUsers } = await sb
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last30Days.toISOString());

    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const currentlyActiveUsers = await SessionLog.distinct('userId', {
      loginAt: { $gte: fiveMinutesAgo },
      $or: [{ logoutAt: { $exists: false } }, { isActive: true }],
    });

    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const { data: recentTools } = await sb
      .from('tool_histories')
      .select('user_id')
      .gte('generated_date', twoMinutesAgo.toISOString());
    const recentActivityUsers = [...new Set((recentTools || []).map((r) => String(r.user_id)))];

    const allCurrentlyActive = [...new Set([...currentlyActiveUsers, ...recentActivityUsers])];

    const { count: totalActiveSubscriptions } = await sb
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const vol = await PaymentHistory.aggregate([{ $match: { status: 'success' } }]);

    const [totalToolUsage, totalPayments, subscriptionStats, toolUsageStats] = await Promise.all([
      ToolHistory.countDocuments({ generatedDate: { $gte: last30Days } }),
      PaymentHistory.countDocuments({}),
      getSubscriptionStats(),
      getToolUsageStats(),
    ]);

    return {
      totalUsers: totalUsers || 0,
      newUsers: newUsers || 0,
      activeUsers: allCurrentlyActive.length,
      totalToolUsage,
      totalPayments,
      totalActiveSubscriptions: totalActiveSubscriptions || 0,
      totalPaymentVolume: vol[0]?.totalVolume || 0,
      subscriptions: subscriptionStats.subscriptions,
      payments: subscriptionStats.payments,
      topTools: toolUsageStats.slice(0, 5),
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

async function cleanupOldActiveSessions() {
  try {
    await SessionLog.updateMany(
      { isActive: true, loginAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } },
      {}
    );
  } catch (error) {
    console.error('Error cleaning up old active sessions:', error);
  }
}

async function getRevenueAnalytics() {
  try {
    await dbConnect();
    return PaymentHistory.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdDate' } },
          totalRevenue: { $sum: '$amount' },
          successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        },
      },
    ]);
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
}

async function getUserDetails(userId) {
  try {
    await dbConnect();
    const sb = getSupabase();

    const { data: userRow, error: userErr } = await sb.from('users').select('*').eq('id', userId).maybeSingle();
    if (userErr) throw userErr;
    if (!userRow) throw new Error('User not found');

    const [{ data: th }, { data: ph }, { data: sl }, { data: ua }] = await Promise.all([
      sb.from('tool_histories').select('*').eq('user_id', userId),
      sb.from('payment_histories').select('*').eq('user_id', userId),
      sb.from('session_logs').select('*').eq('user_id', userId).order('login_at', { ascending: false }).limit(10),
      sb.from('user_analytics').select('*').eq('user_id', userId),
    ]);

    const totalToolUsage = (th || []).length;
    const totalPayments = (ph || []).length;
    const totalSpent = (ph || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    let lastToolUsage = null;
    (th || []).forEach((r) => {
      const d = new Date(r.generated_date);
      if (!lastToolUsage || d > lastToolUsage) lastToolUsage = d;
    });

    const user = {
      ...userRow,
      _id: userRow.id,
      totalToolUsage,
      totalPayments,
      totalSpent,
      lastToolUsage,
      lastLoginAt: sl && sl[0] ? new Date(sl[0].login_at) : null,
      analyticsCount: (ua || []).length,
      additionalData: userRow.additional_data || {},
    };

    const { data: subscriptions } = await sb
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const toolUsageMap = {};
    (th || []).forEach((r) => {
      const k = r.tool_name || 'unknown';
      if (!toolUsageMap[k]) toolUsageMap[k] = { usageCount: 0, lastUsed: null };
      toolUsageMap[k].usageCount += 1;
      const d = new Date(r.generated_date);
      if (!toolUsageMap[k].lastUsed || d > toolUsageMap[k].lastUsed) toolUsageMap[k].lastUsed = d;
    });

    return {
      ...user,
      subscriptions: (subscriptions || []).map((sub) => {
        const now = new Date();
        const subscriptionDate = new Date(sub.created_at);
        let remainingDays = 0;
        let calculatedEndDate = null;
        if (sub.type === 'lifetime') {
          remainingDays = -1;
          calculatedEndDate = null;
        } else {
          const daysSinceSubscription = Math.floor(
            (now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          remainingDays = Math.max(0, 30 - daysSinceSubscription);
          calculatedEndDate = new Date(subscriptionDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
        return {
          type: sub.type,
          amount: sub.amount,
          status: sub.status,
          startDate: sub.created_at,
          endDate: sub.expires_at || calculatedEndDate,
          nextPaymentDate: sub.type === 'monthly' ? sub.expires_at || calculatedEndDate : null,
          remainingDays,
        };
      }),
      paymentHistory: (ph || []).map((payment) => ({
        amount: payment.amount,
        status: payment.status,
        date: payment.created_date,
        description: payment.description || `Payment ${payment.status}`,
      })),
      loginHistory: (sl || []).map((session) => ({
        loginAt: session.login_at,
        logoutAt: session.logout_at,
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
      })),
      toolUsage: Object.entries(toolUsageMap).map(([toolName, v]) => ({
        toolName,
        usageCount: v.usageCount,
        lastUsed: v.lastUsed,
      })),
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
  cleanupOldActiveSessions,
};
