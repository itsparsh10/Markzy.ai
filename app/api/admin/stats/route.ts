import { NextRequest, NextResponse } from 'next/server';
import { 
  getDashboardStats, 
  getToolUsageStats, 
  getSessionAnalytics,
  getUserAnalytics,
  getSubscriptionStats,
  getRevenueAnalytics
} from '../../../../services/adminServices.js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data;
    
    switch (type) {
      case 'dashboard':
        data = await getDashboardStats();
        break;
      case 'toolUsage':
        data = await getToolUsageStats();
        break;
      case 'sessionAnalytics':
        data = await getSessionAnalytics();
        break;
      case 'userAnalytics':
        data = await getUserAnalytics();
        break;
      case 'subscriptionStats':
        data = await getSubscriptionStats();
        break;
      case 'revenueAnalytics':
        data = await getRevenueAnalytics();
        break;
      default:
        // Return all stats
        const [
          dashboardStats, 
          toolUsage, 
          sessionAnalytics,
          userAnalytics,
          subscriptionStats,
          revenueAnalytics
        ] = await Promise.all([
          getDashboardStats(),
          getToolUsageStats(),
          getSessionAnalytics(),
          getUserAnalytics(),
          getSubscriptionStats(),
          getRevenueAnalytics()
        ]);
        
        data = {
          dashboard: dashboardStats,
          toolUsage,
          sessionAnalytics,
          userAnalytics,
          subscriptionStats,
          revenueAnalytics
        };
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 