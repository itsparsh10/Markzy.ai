const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //start data and start time
  userName: { type: String, required: true },
  toolName: { type: String, required: true },
  visitCount: { type: Number, default: 1 },
  // timeSpent is stored as a float (seconds)
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeSpent: { type: Number, default: 0 }, // in seconds (can be float)
});

module.exports = mongoose.models.UserAnalytics || mongoose.model('UserAnalytics', userAnalyticsSchema);
