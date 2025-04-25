const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const exploreRoutes = require('./routes/explore');
const sellRoutes = require('./routes/sell');
const cartRoutes = require('./routes/cart');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create plain MySQL connection (NOT a pool)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Session store using the connection
const sessionStore = new MySQLStore({}, db);

// Middleware
app.use(cors({
  origin: 'https://your-frontend-domain', // replace with your GitHub Pages domain
  credentials: true
}));
app.use(express.json());
app.use(session({
  key: 'reRead_sid',
  secret: 'your_secret_key', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'none',
    secure: true
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/sell', sellRoutes);
app.use('/api/cart', cartRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
