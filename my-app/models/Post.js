import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  buildingName: String,
  type: String,
  notes: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorId: String,   // Added these to match your Dashboard data
  authorName: String, 
  authorPic: String,
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: { expires: 3600 } 
  }
});

// Create the 2dsphere index for geo-queries
postSchema.index({ location: '2dsphere' });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;