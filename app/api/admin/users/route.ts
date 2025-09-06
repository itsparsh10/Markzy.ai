import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '../../../../services/adminServices.js';

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 