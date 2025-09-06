import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import required modules
const User = require('../../../../services/models/User');
const Rating = require('../../../../services/models/Rating');
const dbConnect = require('../../../../services/db');

export async function POST(request: NextRequest) {
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

    // Get user details
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get rating data from request body
    const body = await request.json();
    const { 
      overallRating, 
      easeOfUse, 
      features, 
      support, 
      valueForMoney, 
      feedback, 
      recommendation, 
      userEmail, 
      userName 
    } = body;

    // Validate required fields
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Overall rating is required and must be between 1-5' },
        { status: 400 }
      );
    }

    // Check if user has already rated
    const existingRating = await Rating.findOne({ userId: user._id });
    if (existingRating) {
      return NextResponse.json(
        { success: false, message: 'You have already submitted a rating' },
        { status: 400 }
      );
    }

    // Create rating
    const ratingData = {
      userId: user._id,
      userName: userName || user.name,
      userEmail: userEmail || user.email,
      overallRating,
      easeOfUse: easeOfUse || 0,
      features: features || 0,
      support: support || 0,
      valueForMoney: valueForMoney || 0,
      feedback: feedback || '',
      recommendation: recommendation !== undefined ? recommendation : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const rating = await Rating.create(ratingData);

    console.log(`Rating created: ${rating._id} for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: {
        id: rating._id,
        overallRating: rating.overallRating,
        recommendation: rating.recommendation,
        createdAt: rating.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error creating rating:', error);
    
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
      { success: false, message: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

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
    
    // Get user's ratings
    const ratings = await Rating.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      ratings: ratings.map((rating: any) => ({
        id: rating._id,
        overallRating: rating.overallRating,
        easeOfUse: rating.easeOfUse,
        features: rating.features,
        support: rating.support,
        valueForMoney: rating.valueForMoney,
        feedback: rating.feedback,
        recommendation: rating.recommendation,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt
      }))
    });

  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    
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
      { success: false, message: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
} 