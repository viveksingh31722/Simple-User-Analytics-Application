const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); // Dynamically mirror incoming origin request to support any test domain perfectly
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/causalfunnel_analytics';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

/**
 * @route   POST /api/events
 * @desc    Receive and store client tracking events
 */
app.post('/api/events', async (req, res) => {
  try {
    const { sessionId, eventType, pageUrl, timestamp, x, y, viewportWidth, viewportHeight } = req.body;

    if (!sessionId || !eventType || !pageUrl) {
      return res.status(400).json({ error: 'Missing required event fields: sessionId, eventType, pageUrl' });
    }

    const newEvent = new Event({
      sessionId,
      eventType,
      pageUrl,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      x: eventType === 'click' ? x : null,
      y: eventType === 'click' ? y : null,
      viewportWidth: viewportWidth || null,
      viewportHeight: viewportHeight || null
    });

    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ error: 'Internal server error while saving event' });
  }
});

/**
 * @route   GET /api/sessions
 * @desc    Fetch a list of sessions with total event counts and session duration metrics
 */
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
          pageViews: {
            $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0] }
          },
          startTime: { $min: '$timestamp' },
          endTime: { $max: '$timestamp' },
          pagesVisited: { $addToSet: '$pageUrl' }
        }
      },
      {
        $sort: { startTime: -1 }
      }
    ]);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error while fetching sessions' });
  }
});

/**
 * @route   GET /api/sessions/:sessionId/events
 * @desc    Fetch all chronologically ordered events for a specific session (User Journey)
 */
app.get('/api/sessions/:sessionId/events', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const events = await Event.find({ sessionId }).sort({ timestamp: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching session events:', error);
    res.status(500).json({ error: 'Internal server error while fetching session events' });
  }
});

/**
 * @route   GET /api/pages
 * @desc    Fetch unique pages that have received interaction (for Populating dropdowns)
 */
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Event.distinct('pageUrl');
    res.json(pages);
  } catch (error) {
    console.error('Error fetching distinct pages:', error);
    res.status(500).json({ error: 'Internal server error while fetching distinct pages' });
  }
});

/**
 * @route   GET /api/pages/heatmap
 * @desc    Fetch click data coordinates for a specific page URL
 */
app.get('/api/pages/heatmap', async (req, res) => {
  try {
    const { pageUrl } = req.query;
    if (!pageUrl) {
      return res.status(400).json({ error: 'Query parameter pageUrl is required' });
    }

    const clicks = await Event.find({
      pageUrl,
      eventType: 'click',
      x: { $ne: null },
      y: { $ne: null }
    }).select('x y viewportWidth viewportHeight timestamp -_id');

    res.json(clicks);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Internal server error while fetching heatmap data' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
