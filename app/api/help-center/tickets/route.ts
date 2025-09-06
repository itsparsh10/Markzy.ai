import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import required modules
const User = require('../../../../services/models/User');
const HelpTicket = require('../../../../services/models/HelpTicket');
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

    // Get ticket data from request body
    const body = await request.json();
    const { subject, description, category, priority, userEmail, userName } = body;

    // Validate required fields
    if (!subject || !description || !category) {
      return NextResponse.json(
        { success: false, message: 'Subject, description, and category are required' },
        { status: 400 }
      );
    }

    // Create help ticket
    const ticketData = {
      userId: user._id,
      userName: userName || user.name,
      userEmail: userEmail || user.email,
      subject,
      description,
      category,
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const ticket = await HelpTicket.create(ticketData);

    console.log(`Help ticket created: ${ticket._id} for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Help ticket submitted successfully',
      ticket: {
        id: ticket._id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        createdAt: ticket.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error creating help ticket:', error);
    
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
      { success: false, message: 'Failed to submit help ticket' },
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
    
    // Get user's help tickets
    const tickets = await HelpTicket.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tickets: tickets.map((ticket: any) => ({
        id: ticket._id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }))
    });

  } catch (error: any) {
    console.error('Error fetching help tickets:', error);
    
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
      { success: false, message: 'Failed to fetch help tickets' },
      { status: 500 }
    );
  }
} 