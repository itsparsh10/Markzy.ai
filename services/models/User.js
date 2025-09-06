const mongoose = require('mongoose');
const Subscription = require('./Subscription.js');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  Subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  // External API user ID mapping
  externalUserId: { type: Number, unique: true, sparse: true }, // Maps to external API user_id
  // Additional registration data
  additionalData: {
    firstName: { type: String },
    lastName: { type: String },
    companyName: { type: String },
    jobTitle: { type: String },
    companySize: { type: String },
    industry: { type: String },
    website: { type: String },
    marketingGoals: [{ type: String }],
    monthlyBudget: { type: String },
    marketingTools: [{ type: String }],
    subscribeNewsletter: { type: Boolean, default: true }
  }
});

// Virtual for subscription
userSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: 'Subscription_id',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
