import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from different sources
    const cookieToken = request.cookies.get('authToken')?.value;
    const headerToken = request.headers.get('authorization');
    
    console.log('Cookie token:', cookieToken ? `${cookieToken.substring(0, 20)}...` : 'No cookie token');
    console.log('Header token:', headerToken ? `${headerToken.substring(0, 20)}...` : 'No header token');
    
    return NextResponse.json({
      success: true,
      cookieToken: cookieToken ? `${cookieToken.substring(0, 20)}...` : null,
      headerToken: headerToken ? `${headerToken.substring(0, 20)}...` : null,
      cookieLength: cookieToken?.length || 0,
      headerLength: headerToken?.length || 0
    });
  } catch (error) {
    console.error('Test token error:', error);
    return NextResponse.json(
      { success: false, message: 'Test failed' },
      { status: 500 }
    );
  }
} 