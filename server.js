require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const mysql = require('mysql2');

// Import routes
const authRoutes = require('./routes/auth');
const sellRoutes = require('./routes/sell');
const exploreRoute = require('./routes/explore');

const app = express();


// Enable CORS for GitHub Pages
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure session store with MySQL
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Set up express-session with MySQL store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    sameSite: 'none',
    secure: true
  }
}));

// Mount routes
app.use('/auth', authRoutes);
app.use('/api/sell', sellRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/explore', exploreRoute);

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Root route for test

app.get('/', (req, res) => {
  res.send('🚀 Backend is live!');
});

// Start server (IMPORTANT: Railway needs process.env.PORT ONLY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
