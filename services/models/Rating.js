const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // User reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  
  // Rating details
  overallRating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  easeOfUse: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 0
  },
  features: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 0
  },
  support: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 0
  },
  valueForMoney: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 0
  },
  
  // Feedback
  feedback: { type: String },
  recommendation: { type: Boolean, default: true },
  
  // Admin review
  adminNotes: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ratingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for average rating
ratingSchema.virtual('averageRating').get(function() {
  const ratings = [this.easeOfUse, this.features, this.support, this.valueForMoney].filter(r => r > 0);
  if (ratings.length === 0) return this.overallRating;
  return (ratings.reduce((a, b) => a + b, 0) + this.overallRating) / (ratings.length + 1);
});

module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema); 