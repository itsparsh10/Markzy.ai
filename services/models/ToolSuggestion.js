const mongoose = require('mongoose');

const toolSuggestionSchema = new mongoose.Schema({
  // User reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  
  // Suggestion details
  toolName: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Content Creation',
      'Social Media',
      'Email Marketing',
      'SEO & Analytics',
      'Sales & Funnels',
      'Brand Management',
      'Product Marketing',
      'Customer Research',
      'Automation',
      'Integration',
      'Other'
    ]
  },
  useCase: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'implemented'], 
    default: 'pending' 
  },
  
  // Admin review
  adminNotes: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  implementedAt: { type: Date },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
toolSuggestionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.ToolSuggestion || mongoose.model('ToolSuggestion', toolSuggestionSchema); 