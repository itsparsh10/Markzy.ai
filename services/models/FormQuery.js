import mongoose from 'mongoose';

const formQuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  industry: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'in-progress', 'resolved', 'closed'], 
    default: 'new' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignedTo: { type: String },
  response: { type: String },
  tags: [{ type: String }],
  source: { type: String, default: 'landing-page' }
});

// Update the updatedAt field before saving
formQuerySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create compound index for better query performance
formQuerySchema.index({ email: 1, createdAt: -1 });
formQuerySchema.index({ status: 1, priority: 1 });
formQuerySchema.index({ createdAt: -1 });

export default mongoose.models.FormQuery || mongoose.model('FormQuery', formQuerySchema);
