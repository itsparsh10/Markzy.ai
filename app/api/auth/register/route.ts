import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../services/db.js';
import User from '../../../../services/models/User.js';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userData = await request.json();
    const { email, password, firstName, lastName, companyName, jobTitle, companySize, industry, website, marketingGoals, monthlyBudget, marketingTools, subscribeNewsletter } = userData;
    
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase() : '';
    
    // Validate required fields
    if (!normalizedEmail || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password (10 rounds for faster registration while keeping good security)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const created = await User.create({
      email: normalizedEmail,
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
        subscribeNewsletter,
      },
    });

    if (!created) {
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: created._id,
        email: created.email,
        name: created.name,
      },
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 