import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or headers
    let token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          id: decoded.userId,
          email: decoded.email
        }
      });
    } catch (jwtError) {
      return NextResponse.json(
        { isAuthenticated: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { isAuthenticated: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 