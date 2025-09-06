import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../services/db.js';
import User from '../../../../services/models/User.js';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userData = await request.json();
    const { email, password, firstName, lastName, companyName, jobTitle, companySize, industry, website, marketingGoals, monthlyBudget, marketingTools, subscribeNewsletter } = userData;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user with all registration data
    const user = new User({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      additionalData: {
        firstName,
        lastName,
        companyName,
        jobTitle,
        companySize,
        industry,
        website,
        marketingGoals,
        monthlyBudget,
        marketingTools,
        subscribeNewsletter
      }
    });
    
    await user.save();
    
    // Return success response
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 