import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../services/db.js';
import PaymentHistory from '../../../../services/models/PaymentHistory.js';
import User from '../../../../services/models/User.js';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    
    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    
    // Get total count
    const totalCount = await PaymentHistory.countDocuments(query);
    
    // Get payment history with pagination
    const payments = await PaymentHistory.find(query)
      .sort({ createdDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email');
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Get summary statistics
    const totalRevenue = await PaymentHistory.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const successCount = await PaymentHistory.countDocuments({ status: 'success' });
    const failedCount = await PaymentHistory.countDocuments({ status: 'failed' });
    const pendingCount = await PaymentHistory.countDocuments({ status: 'pending' });
    
    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        },
        summary: {
          totalRevenue: totalRevenue[0]?.total || 0,
          successCount,
          failedCount,
          pendingCount
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
} 