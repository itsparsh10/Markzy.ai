const mongoose = require('mongoose');

const sessionLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  loginAt: { 
    type: Date, 
    required: true 
  },
  logoutAt: { 
    type: Date 
  },
  duration: { 
    type: Number, // Duration in seconds
    default: 0 
  },
  toolName: { 
    type: String 
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better query performance
sessionLogSchema.index({ userId: 1, loginAt: -1 });
sessionLogSchema.index({ toolName: 1 });
sessionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.models.SessionLog || mongoose.model('SessionLog', sessionLogSchema); 