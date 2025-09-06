const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // Stripe session ID
  subscriptionId: { type: String, required: true, unique: true },
  
  // User reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  
  // Subscription details
  subscriptionName: { type: String, required: true },
  type: { type: String, enum: ['monthly', 'lifetime'], required: true },
  duration: { type: Number, required: true }, // in days for monthly, -1 for lifetime
  
  // Status tracking
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  
  // Dates
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  
  // Stripe details
  stripeSessionId: { type: String },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  
  // Additional metadata
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Legacy fields for backward compatibility
  details: { type: String },
  numberOfUsers: { type: Number, default: 1 },
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
