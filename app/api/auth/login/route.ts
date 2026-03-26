import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../services/db.js';
import User from '../../../../services/models/User.js';
import SessionLog from '../../../../services/models/SessionLog.js';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase() : '';
    
    // Validate input
    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    if (user.isActive === false) {
      return NextResponse.json(
        { message: 'Account disabled' },
        { status: 403 }
      );
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, user_id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Log the login session
    try {
      const sessionLog = new SessionLog({
        userId: user._id,
        loginAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        isActive: true
      });
      
      await sessionLog.save();
      console.log(`Login session logged for user: ${user.email}`);
    } catch (sessionError) {
      console.error('Error logging session:', sessionError);
      // Don't fail login if session logging fails
    }
    
    // Simple response with user data
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        additionalData: user.additionalData
      },
      access: token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 