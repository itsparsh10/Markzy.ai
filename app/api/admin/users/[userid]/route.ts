import { NextRequest, NextResponse } from 'next/server';
import { getUserDetails } from '../../../../../services/adminServices.js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userid: string }> }
) {
  try {
    const { userid } = await params;
    
    if (!userid) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const userDetails = await getUserDetails(userid);
    
    return NextResponse.json({
      success: true,
      data: userDetails
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch user details';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        errorMessage = 'User not found';
        statusCode = 404;
      } else if (error.message === 'Invalid user ID format') {
        errorMessage = 'Invalid user ID format';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
} 