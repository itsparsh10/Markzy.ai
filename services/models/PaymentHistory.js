const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  userEmail: { type: String },
  subscriptionId: { type: String },
  subscriptionName: { type: String },
  planName: { type: String },
  planId: { type: String },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], required: true },
  invoiceUrl: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  paymentMethod: { type: String },
  currency: { type: String, default: 'USD' },
  customerDetails: { type: mongoose.Schema.Types.Mixed }
});

// Add compound unique index to prevent duplicate payments
paymentHistorySchema.index(
  { subscriptionId: 1, userId: 1, amount: 1 }, 
  { unique: true, sparse: true }
);

module.exports = mongoose.models.PaymentHistory || mongoose.model('PaymentHistory', paymentHistorySchema);
