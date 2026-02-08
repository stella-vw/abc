const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// 3. Import Models 
// Adjusting these based on your 'ls' output: User is in models, Post is in abc root.
const User = require('./models/User'); 
const Post = require('./models/Post');        

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Connection Failed:", err));

// 5. ROUTES

// --- HOME ROUTE ---
app.get('/', (req, res) => {
  // Fixed: Sending file directly from 'abc' folder based on your 'ls' results
  res.sendFile(path.join(__dirname, 'html','create-post.html'));
});

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    res.json({ message: "Login successful!", user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CREATE POST ROUTE ---
app.post('/api/posts', async (req, res) => {
  try {
    const { location, type, time, notes } = req.body;
    const newPost = new Post({
      title: location, 
      type: type,
      notes: notes,
      location: { type: 'Point', coordinates: [-73.5772, 45.5048] } 
    });

    await newPost.save();
    res.send('<h1>Post Successful!</h1><a href="/">Go Back</a>');
  } catch (err) {
    res.status(400).send("Error saving post: " + err.message);
  }
});

// 6. Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});