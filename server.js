require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');
const mysql = require('mysql2');


const app = express();

app.set('trust proxy', 1);

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Enable CORS for GitHub Pages
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: true
  }
}));



// Mount routes
const sellRoutes = require('./routes/sell');
const exploreRoute = require('./routes/explore');
const profileRoutes = require('./routes/profile');


app.use('/auth', authRoutes);
app.use('/api/sell', sellRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/explore', exploreRoute);
app.use('/profile', profileRoutes);

// Root route for test
app.get('/', (req, res) => {
  res.send('🚀 Backend is live!');
});

// Start server (IMPORTANT: Railway needs process.env.PORT ONLY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
