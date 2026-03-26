const { getSupabase } = require('../supabaseClient');

function toPay(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    subscriptionId: row.subscription_id,
    subscriptionName: row.subscription_name,
    planName: row.plan_name,
    planId: row.plan_id,
    description: row.description,
    createdDate: row.created_date ? new Date(row.created_date) : null,
    amount: row.amount,
    status: row.status,
    invoiceUrl: row.invoice_url,
    metadata: row.metadata,
    paymentMethod: row.payment_method,
    currency: row.currency,
    customerDetails: row.customer_details,
  };
}

function toRow(data) {
  return {
    user_id: data.userId,
    user_name: data.userName,
    user_email: data.userEmail,
    subscription_id: data.subscriptionId,
    subscription_name: data.subscriptionName,
    plan_name: data.planName,
    plan_id: data.planId,
    description: data.description,
    created_date: data.createdDate ? new Date(data.createdDate).toISOString() : undefined,
    amount: data.amount,
    status: data.status,
    invoice_url: data.invoiceUrl,
    metadata: data.metadata,
    payment_method: data.paymentMethod,
    currency: data.currency || 'USD',
    customer_details: data.customerDetails,
  };
}

async function findById(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from('payment_histories').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return toPay(data);
}

async function findOne(query, options = {}) {
  const sb = getSupabase();
  let q = sb.from('payment_histories').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.subscriptionId) q = q.eq('subscription_id', query.subscriptionId);
  if (query._id) q = q.eq('id', query._id);
  const ascending = options.sort && options.sort.createdDate === 1;
  q = q.order('created_date', { ascending }).limit(1);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return toPay(data);
}

async function find(query = {}, options = {}) {
  const sb = getSupabase();
  let q = sb.from('payment_histories').select('*');
  if (query.userId) q = q.eq('user_id', query.userId);
  if (query.status) q = q.eq('status', query.status);
  if (query.metadata && typeof query.metadata.testPayment !== 'undefined') {
    q = q.contains('metadata', { testPayment: query.metadata.testPayment });
  }
  const ascending = options.sort && options.sort.createdDate === 1;
  q = q.order('created_date', { ascending });
  if (options.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(toPay);
}

class PaymentHistoryDoc {
  constructor(data) {
    Object.assign(this, data);
  }
  async save() {
    const row = await create({
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      subscriptionId: this.subscriptionId,
      createdDate: this.createdDate,
      amount: this.amount,
      status: this.status,
      planName: this.planName,
      planId: this.planId,
      invoiceUrl: this.invoiceUrl,
      metadata: this.metadata,
      paymentMethod: this.paymentMethod,
      currency: this.currency,
      description: this.description,
    });
    Object.assign(this, row);
    this._id = row._id;
    return this;
  }
}

async function create(data) {
  const sb = getSupabase();
  const row = toRow(data);
  const { data: inserted, error } = await sb.from('payment_histories').insert(row).select('*').single();
  if (error) throw error;
  return toPay(inserted);
}

async function countDocuments(filter = {}) {
  const sb = getSupabase();
  let q = sb.from('payment_histories').select('*', { count: 'exact', head: true });
  if (filter.status) q = q.eq('status', filter.status);
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
}

async function aggregate(pipeline) {
  const sb = getSupabase();
  const first = pipeline[0];
  if (first && first.$match && first.$match.status === 'success' && !pipeline[1]) {
    const { data, error } = await sb.from('payment_histories').select('amount').eq('status', 'success');
    if (error) throw error;
    const totalVolume = (data || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return [{ _id: null, totalVolume }];
  }
  if (pipeline[0] && pipeline[0].$group && pipeline[0].$group._id === '$status') {
    const { data, error } = await sb.from('payment_histories').select('status, amount');
    if (error) throw error;
    const map = {};
    (data || []).forEach((row) => {
      const k = row.status;
      if (!map[k]) map[k] = { _id: k, count: 0, totalAmount: 0 };
      map[k].count += 1;
      map[k].totalAmount += Number(row.amount) || 0;
    });
    return Object.values(map);
  }
  if (pipeline[0] && pipeline[0].$group && pipeline[0].$group._id && pipeline[0].$group._id.$dateToString) {
    const { data, error } = await sb.from('payment_histories').select('created_date, amount, status');
    if (error) throw error;
    const byMonth = {};
    (data || []).forEach((row) => {
      const d = new Date(row.created_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth[key]) {
        byMonth[key] = {
          _id: key,
          totalRevenue: 0,
          successfulPayments: 0,
          failedPayments: 0,
        };
      }
      byMonth[key].totalRevenue += Number(row.amount) || 0;
      if (row.status === 'success') byMonth[key].successfulPayments += 1;
      if (row.status === 'failed') byMonth[key].failedPayments += 1;
    });
    return Object.values(byMonth).sort((a, b) => (a._id < b._id ? 1 : -1));
  }
  return [];
}

async function findByIdAndDelete(id) {
  const sb = getSupabase();
  const { error } = await sb.from('payment_histories').delete().eq('id', id);
  if (error) throw error;
}

const PaymentHistory = PaymentHistoryDoc;
PaymentHistoryDoc.findById = findById;
PaymentHistoryDoc.findOne = findOne;
PaymentHistoryDoc.find = find;
PaymentHistoryDoc.create = create;
PaymentHistoryDoc.countDocuments = countDocuments;
PaymentHistoryDoc.aggregate = aggregate;
PaymentHistoryDoc.findByIdAndDelete = findByIdAndDelete;

module.exports = PaymentHistory;
