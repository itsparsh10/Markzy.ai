import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import FormQuery from '../../../services/models/FormQuery.js';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const body = await request.json();
    const { name, email, company, industry, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create new form query
    const formQuery = new FormQuery({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || '',
      industry: industry || '',
      message: message?.trim() || '',
      status: 'new',
      priority: 'medium',
      source: 'landing-page'
    });

    // Save to database
    await formQuery.save();

    console.log(`New form query submitted: ${formQuery._id} from ${email}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully! We\'ll respond within 24 hours.',
        queryId: formQuery._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting form query:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get form queries with pagination
    const formQueries = await FormQuery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await FormQuery.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: formQueries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching form queries:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch form queries' },
      { status: 500 }
    );
  }
}
