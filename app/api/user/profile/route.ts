import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '../../../../services/user.js';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from token - check both cookie and authorization header
    let token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else if (authHeader && authHeader.startsWith('bearer ')) {
        token = authHeader.replace('bearer ', '');
      }
    }
    
    console.log('Token received:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate token format
    if (typeof token !== 'string' || token.length < 10) {
      console.error('Invalid token format:', token);
      return NextResponse.json(
        { success: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

    const userProfile = await getUserProfile(token);
    
    return NextResponse.json({
      success: true,
      user: userProfile
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, message: 'Token has expired' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user ID from token - check both cookie and authorization header
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

    // Validate token format
    if (typeof token !== 'string' || token.length < 10) {
      console.error('Invalid token format:', token);
      return NextResponse.json(
        { success: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const updatedUser = await updateUserProfile(token, body);
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, message: 'Token has expired' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 