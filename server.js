const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Middleware
app.use(express.json()); // Allows the server to read JSON sent from your website
app.use(cors());         // Allows your frontend to talk to this backend

// 3. Import Models
// Make sure you have a folder named 'models' with User.js inside it
const User = require('./models/User');

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Connection Failed:", err));

// 5. API Routes

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Create new user (Saving raw password as requested)
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

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Direct password check (No hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({ 
      message: "Login successful!", 
      user: { username: user.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});