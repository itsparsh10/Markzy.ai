import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../services/db.js';
import { getSupabase } from '../../../../services/supabaseClient.js';
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const sb = getSupabase();
    const skip = (page - 1) * limit;

    let countQ = sb.from('payment_histories').select('*', { count: 'exact', head: true });
    if (status) countQ = countQ.eq('status', status);
    if (userId) countQ = countQ.eq('user_id', userId);
    const { count: totalCount, error: countErr } = await countQ;
    if (countErr) throw countErr;

    let dataQ = sb.from('payment_histories').select('*');
    if (status) dataQ = dataQ.eq('status', status);
    if (userId) dataQ = dataQ.eq('user_id', userId);
    dataQ = dataQ.order('created_date', { ascending: false }).range(skip, skip + limit - 1);

    const { data: rows, error } = await dataQ;
    if (error) throw error;

    const userIds = Array.from(
      new Set((rows || []).map((r: { user_id: string }) => r.user_id).filter(Boolean))
    );
    const { data: users } =
      userIds.length > 0
        ? await sb.from('users').select('id, name, email').in('id', userIds)
        : { data: [] };
    type URow = { id: string; name: string; email: string };
    const userMap = new Map((users || []).map((u: URow) => [u.id, u]));

    const payments = (rows || []).map((r: Record<string, unknown>) => {
      const uid = r.user_id as string;
      const u = userMap.get(uid) as URow | undefined;
      return {
        _id: r.id,
        userId: uid,
        userName: r.user_name,
        userEmail: r.user_email,
        amount: r.amount,
        status: r.status,
        createdDate: r.created_date,
        subscriptionId: r.subscription_id,
        planName: r.plan_name,
        user: u ? { name: u.name, email: u.email } : null,
      };
    });

    const totalPages = Math.ceil((totalCount || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const { data: successRows } = await sb.from('payment_histories').select('amount').eq('status', 'success');
    const totalRevenue = (successRows || []).reduce((s: number, r: { amount: number }) => s + (Number(r.amount) || 0), 0);

    const { count: successCount } = await sb
      .from('payment_histories')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'success');
    const { count: failedCount } = await sb
      .from('payment_histories')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');
    const { count: pendingCount } = await sb
      .from('payment_histories')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

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
          limit,
        },
        summary: {
          totalRevenue,
          successCount: successCount ?? 0,
          failedCount: failedCount ?? 0,
          pendingCount: pendingCount ?? 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}