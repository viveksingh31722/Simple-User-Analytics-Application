const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: ['page_view', 'click'],
    required: true
  },
  pageUrl: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Click coordinates, required only if eventType === 'click'
  x: {
    type: Number,
    default: null
  },
  y: {
    type: Number,
    default: null
  },
  // Viewport dimensions for layout normalization
  viewportWidth: {
    type: Number,
    default: null
  },
  viewportHeight: {
    type: Number,
    default: null
  }
});

// Compound index to quickly fetch all events of a session ordered by timestamp
eventSchema.index({ sessionId: 1, timestamp: 1 });

module.exports = mongoose.model('Event', eventSchema);
