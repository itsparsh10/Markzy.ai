const mongoose = require('mongoose');

const toolHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toolName: String,
  toolId: String,
  outputResult: { type: Object, default: {} },
  generatedDate: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.ToolHistory || mongoose.model('ToolHistory', toolHistorySchema);
