import { NextRequest, NextResponse } from 'next/server';
import { getUserBrands } from '../../../../services/user.js';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from token
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const brands = await getUserBrands(decoded.userId);
    
    return NextResponse.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Error fetching user brands:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user brands' },
      { status: 500 }
    );
  }
} 