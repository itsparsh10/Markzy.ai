import { NextRequest, NextResponse } from 'next/server';

// Import required modules
const User = require('../../../../services/models/User');
const HelpTicket = require('../../../../services/models/HelpTicket');
const ToolSuggestion = require('../../../../services/models/ToolSuggestion');
const Rating = require('../../../../services/models/Rating');
const dbConnect = require('../../../../services/db');

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Fetch all support data - only show open and in-progress tickets
    const [tickets, suggestions, ratings] = await Promise.all([
      HelpTicket.find({ status: { $in: ['open', 'in-progress'] } }).sort({ createdAt: 1 }).populate('userId', 'name email'),
      ToolSuggestion.find({}).sort({ createdAt: -1 }).populate('userId', 'name email'),
      Rating.find({}).sort({ createdAt: -1 }).populate('userId', 'name email')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tickets: tickets.map((ticket: any) => ({
          _id: ticket._id,
          userId: ticket.userId?._id || null,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          userEmail: ticket.userEmail || (ticket.userId?.email || null),
          userName: ticket.userName || (ticket.userId?.name || null),
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt
        })),
        suggestions: suggestions.map((suggestion: any) => ({
          _id: suggestion._id,
          userId: suggestion.userId?._id || null,
          toolName: suggestion.toolName,
          description: suggestion.description,
          category: suggestion.category,
          useCase: suggestion.useCase,
          priority: suggestion.priority,
          status: suggestion.status,
          userEmail: suggestion.userEmail || (suggestion.userId?.email || null),
          userName: suggestion.userName || (suggestion.userId?.name || null),
          createdAt: suggestion.createdAt,
          updatedAt: suggestion.updatedAt
        })),
        ratings: ratings.map((rating: any) => ({
          _id: rating._id,
          userId: rating.userId?._id || null,
          overallRating: rating.overallRating,
          easeOfUse: rating.easeOfUse,
          features: rating.features,
          support: rating.support,
          valueForMoney: rating.valueForMoney,
          feedback: rating.feedback,
          recommendation: rating.recommendation,
          userEmail: rating.userEmail || (rating.userId?.email || null),
          userName: rating.userName || (rating.userId?.name || null),
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt
        }))
      }
    });

  } catch (error: any) {
    console.error('Error fetching support data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch support data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ticketId, status } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID and status are required' },
        { status: 400 }
      );
    }

    // Update the ticket status
    const updatedTicket = await HelpTicket.findByIdAndUpdate(
      ticketId,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, message: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${status === 'resolved' ? 'resolved' : 'rejected'} successfully`,
      data: {
        _id: updatedTicket._id,
        userId: updatedTicket.userId?._id || null,
        subject: updatedTicket.subject,
        description: updatedTicket.description,
        category: updatedTicket.category,
        priority: updatedTicket.priority,
        status: updatedTicket.status,
        userEmail: updatedTicket.userEmail || (updatedTicket.userId?.email || null),
        userName: updatedTicket.userName || (updatedTicket.userId?.name || null),
        createdAt: updatedTicket.createdAt,
        updatedAt: updatedTicket.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update ticket status' },
      { status: 500 }
    );
  }
} 