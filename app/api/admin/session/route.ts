import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../services/db.js';
import SessionLog from '../../../../services/models/SessionLog.js';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { userId, action, toolName, ipAddress, userAgent } = await request.json();
    
    if (!userId || !action) {
      return NextResponse.json(
        { message: 'userId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      // Create new session log
      const sessionLog = new SessionLog({
        userId,
        loginAt: new Date(),
        toolName,
        ipAddress,
        userAgent,
        isActive: true
      });
      
      await sessionLog.save();
      
      return NextResponse.json({
        success: true,
        sessionId: sessionLog._id
      });
    } else if (action === 'logout') {
      // Find and update the most recent active session for this user
      const sessionLog = await SessionLog.findOneAndUpdate(
        { userId, isActive: true },
        {
          logoutAt: new Date(),
          isActive: false,
        },
        { new: true }
      );
      
      if (!sessionLog) {
        return NextResponse.json(
          { message: 'No active session found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        sessionId: sessionLog._id,
        duration: sessionLog.duration
      });
    } else if (action === 'tool_usage') {
      // Log tool usage
      const sessionLog = new SessionLog({
        userId,
        loginAt: new Date(),
        logoutAt: new Date(),
        duration: 0,
        toolName,
        ipAddress,
        userAgent,
        isActive: false
      });
      
      await sessionLog.save();
      
      return NextResponse.json({
        success: true,
        sessionId: sessionLog._id
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use login, logout, or tool_usage' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Session log error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }
    
    const sessions = await SessionLog.find(
      { userId },
      { sort: { loginAt: -1 }, limit: 50 }
    );
    
    return NextResponse.json({
      success: true,
      data: sessions
    });
    
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 