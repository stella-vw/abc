const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  type: String, // e.g., 'Warning', 'Event', 'Photo'
  notes: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// This index is crucial for map-based searches
postSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', postSchema);