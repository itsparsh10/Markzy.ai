import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import required modules
const User = require('../../../../services/models/User');
const ToolSuggestion = require('../../../../services/models/ToolSuggestion');
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

    // Get suggestion data from request body
    const body = await request.json();
    const { toolName, description, category, useCase, priority, userEmail, userName } = body;

    // Validate required fields
    if (!toolName || !description || !category || !useCase) {
      return NextResponse.json(
        { success: false, message: 'Tool name, description, category, and use case are required' },
        { status: 400 }
      );
    }

    // Create tool suggestion
    const suggestionData = {
      userId: user._id,
      userName: userName || user.name,
      userEmail: userEmail || user.email,
      toolName,
      description,
      category,
      useCase,
      priority: priority || 'medium',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const suggestion = await ToolSuggestion.create(suggestionData);

    console.log(`Tool suggestion created: ${suggestion._id} for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Tool suggestion submitted successfully',
      suggestion: {
        id: suggestion._id,
        toolName: suggestion.toolName,
        category: suggestion.category,
        status: suggestion.status,
        createdAt: suggestion.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error creating tool suggestion:', error);
    
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
      { success: false, message: 'Failed to submit tool suggestion' },
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
    
    // Get user's tool suggestions
    const suggestions = await ToolSuggestion.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      suggestions: suggestions.map((suggestion: any) => ({
        id: suggestion._id,
        toolName: suggestion.toolName,
        category: suggestion.category,
        status: suggestion.status,
        priority: suggestion.priority,
        createdAt: suggestion.createdAt,
        updatedAt: suggestion.updatedAt
      }))
    });

  } catch (error: any) {
    console.error('Error fetching tool suggestions:', error);
    
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
      { success: false, message: 'Failed to fetch tool suggestions' },
      { status: 500 }
    );
  }
} 