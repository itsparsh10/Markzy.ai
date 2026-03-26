import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../services/db.js';
import User from '../../../../services/models/User.js';
import PaymentHistory from '../../../../services/models/PaymentHistory.js';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or headers
    let token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else if (authHeader && authHeader.startsWith('bearer ')) {
        token = authHeader.replace('bearer ', '');
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    await dbConnect();
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get payment history count
    const paymentHistoryCount = await PaymentHistory.countDocuments({ userId: userId });
    
    // Get latest payment
    const latestPayment = await PaymentHistory.findOne(
      { userId: userId },
      { sort: { createdDate: -1 } }
    );

    return NextResponse.json({
      success: true,
      debug: {
        tokenUserId: userId,
        userEmail: user.email,
        userName: user.name,
        userCreatedAt: user.createdAt,
        userUpdatedAt: (user as { updatedAt?: Date }).updatedAt,
        paymentHistoryCount: paymentHistoryCount,
        latestPayment: latestPayment ? {
          id: latestPayment._id,
          planName: latestPayment.planName,
          amount: latestPayment.amount,
          createdDate: latestPayment.createdDate,
          userId: latestPayment.userId
        } : null,
        localStorage: {
          note: 'Check browser localStorage for userData and authToken'
        }
      }
    });

  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json(
      { success: false, message: 'Debug error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
