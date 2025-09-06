import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple admin check - for now, just verify token exists
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Use the existing database connection pattern
    const User = require('../../../../services/models/User.js');
    const ToolHistory = require('../../../../services/models/ToolHistory.js');
    const SessionLog = require('../../../../services/models/SessionLog.js');
    const Subscription = require('../../../../services/models/Subscription.js');
    const dbConnect = require('../../../../services/db.js');
    
    await dbConnect();
    
    // Get all tool history records first
    const allToolHistory = await ToolHistory.find({}).populate('userId', 'name email');
    console.log('All Tool History Records:', allToolHistory.length);

    // Get all active subscriptions for users
    const allSubscriptions = await Subscription.find({ status: 'active' }).sort({ createdAt: -1 });
    const userSubscriptionMap = new Map();
    
    allSubscriptions.forEach((subscription: any) => {
      userSubscriptionMap.set(subscription.userId.toString(), {
        subscriptionName: subscription.subscriptionName,
        type: subscription.type,
        status: subscription.status
      });
    });
    
    // Group by user and tool to count usage
    const toolUsageMap = new Map();
    
    allToolHistory.forEach((record: any) => {
      const userId = record.userId;
      const toolName = record.toolName;
      const key = `${userId._id}-${toolName}`;
      
      // Get user's subscription info
      const userSubscription = userSubscriptionMap.get(userId._id.toString());
      const subscriptionName = userSubscription ? userSubscription.subscriptionName : 'Free';
      const subscriptionType = userSubscription ? userSubscription.type : 'free';
      const subscriptionStatus = userSubscription ? userSubscription.status : 'inactive';
      
      if (!toolUsageMap.has(key)) {
        toolUsageMap.set(key, {
          _id: userId._id,
          username: userId.name || 'Unknown User',
          email: userId.email || 'unknown@example.com',
          toolName: toolName,
          usageCount: 0,
          lastVisited: record.generatedDate,
          firstUsed: record.generatedDate,
          subscription: subscriptionName,
          subscriptionType: subscriptionType,
          status: subscriptionStatus
        });
      }
      
      const entry = toolUsageMap.get(key);
      entry.usageCount += 1;
      
      if (new Date(record.generatedDate) > new Date(entry.lastVisited)) {
        entry.lastVisited = record.generatedDate;
      }
      
      if (new Date(record.generatedDate) < new Date(entry.firstUsed)) {
        entry.firstUsed = record.generatedDate;
      }
    });
    
    const toolHistoryData = Array.from(toolUsageMap.values()).sort((a: any, b: any) => 
      new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
    );

    console.log('Tool History Data:', JSON.stringify(toolHistoryData, null, 2));

    // Also get a simple count to verify
    const totalToolHistoryCount = await ToolHistory.countDocuments();
    console.log('Total Tool History Records:', totalToolHistoryCount);

    // If no data from aggregation, create sample data for demonstration
    if (toolHistoryData.length === 0) {
      const sampleData = [
        {
          _id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          toolName: 'BlogGenerator',
          usageCount: 15,
          lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Premium Plan',
          subscriptionType: 'monthly',
          status: 'active'
        },
        {
          _id: '2',
          username: 'jane_smith',
          email: 'jane@example.com',
          toolName: 'EmailNewsletter',
          usageCount: 8,
          lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Basic Plan',
          subscriptionType: 'monthly',
          status: 'active'
        },
        {
          _id: '3',
          username: 'mike_wilson',
          email: 'mike@example.com',
          toolName: 'SocialPosts',
          usageCount: 23,
          lastVisited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Lifetime Plan',
          subscriptionType: 'lifetime',
          status: 'active'
        },
        {
          _id: '4',
          username: 'sarah_jones',
          email: 'sarah@example.com',
          toolName: 'SEOMagic',
          usageCount: 12,
          lastVisited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Premium Plan',
          subscriptionType: 'monthly',
          status: 'inactive'
        },
        {
          _id: '5',
          username: 'alex_brown',
          email: 'alex@example.com',
          toolName: 'ProductDescription',
          usageCount: 6,
          lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Basic Plan',
          subscriptionType: 'monthly',
          status: 'active'
        },
        {
          _id: '6',
          username: 'emma_davis',
          email: 'emma@example.com',
          toolName: 'SalesPage',
          usageCount: 19,
          lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Lifetime Plan',
          subscriptionType: 'lifetime',
          status: 'active'
        },
        {
          _id: '7',
          username: 'david_lee',
          email: 'david@example.com',
          toolName: 'ContentIdeas',
          usageCount: 31,
          lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Premium Plan',
          subscriptionType: 'monthly',
          status: 'active'
        },
        {
          _id: '8',
          username: 'lisa_wang',
          email: 'lisa@example.com',
          toolName: 'BrandBios',
          usageCount: 4,
          lastVisited: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Free',
          subscriptionType: 'free',
          status: 'inactive'
        },
        {
          _id: '9',
          username: 'tom_harris',
          email: 'tom@example.com',
          toolName: 'Freestyle',
          usageCount: 27,
          lastVisited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Lifetime Plan',
          subscriptionType: 'lifetime',
          status: 'active'
        },
        {
          _id: '10',
          username: 'anna_clark',
          email: 'anna@example.com',
          toolName: 'VideoScripts',
          usageCount: 14,
          lastVisited: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          subscription: 'Premium Plan',
          subscriptionType: 'monthly',
          status: 'active'
        }
      ];

      return NextResponse.json({
        success: true,
        data: sampleData,
        message: 'Sample user analytics data loaded'
      });
    }

    return NextResponse.json({
      success: true,
      data: toolHistoryData,
      message: 'User analytics data retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 