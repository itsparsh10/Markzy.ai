import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../services/db.js';
import { getSupabase } from '../../../services/supabaseClient.js';

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

    const sb = getSupabase();
    const { data: row, error } = await sb
      .from('form_queries')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company?.trim() || '',
        industry: industry || '',
        message: message?.trim() || '',
        status: 'new',
        priority: 'medium',
        source: 'landing-page',
      })
      .select('id')
      .single();

    if (error) throw error;

    console.log(`New form query submitted: ${row.id} from ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully! We\'ll respond within 24 hours.',
        queryId: row.id,
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
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const skip = (page - 1) * limit;

    const sb = getSupabase();
    let countQ = sb.from('form_queries').select('*', { count: 'exact', head: true });
    if (status) countQ = countQ.eq('status', status);
    if (priority) countQ = countQ.eq('priority', priority);
    const { count: totalCount, error: countErr } = await countQ;
    if (countErr) throw countErr;

    let dataQ = sb.from('form_queries').select('*');
    if (status) dataQ = dataQ.eq('status', status);
    if (priority) dataQ = dataQ.eq('priority', priority);
    dataQ = dataQ.order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    const { data: formQueries, error } = await dataQ;
    if (error) throw error;

    const total = totalCount ?? 0;

    return NextResponse.json({
      success: true,
      data: formQueries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching form queries:', error);

    return NextResponse.json(
      { error: 'Failed to fetch form queries' },
      { status: 500 }
    );
  }
}
