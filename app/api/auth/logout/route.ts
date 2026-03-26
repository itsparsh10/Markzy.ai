import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../services/db.js';
import SessionLog from '../../../../services/models/SessionLog.js';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    
    // Find and update the most recent active session for this user
    try {
      const sessionLog = await SessionLog.findOneAndUpdate(
        { userId, isActive: true },
        {
          logoutAt: new Date(),
          isActive: false,
        },
        { new: true }
      );
      
      if (sessionLog) {
        console.log(`Logout session logged for user ID: ${userId}`);
      } else {
        console.log(`No active session found for user ID: ${userId}`);
      }
    } catch (sessionError) {
      console.error('Error logging logout session:', sessionError);
      // Don't fail logout if session logging fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 