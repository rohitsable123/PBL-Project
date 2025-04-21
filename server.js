const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Enable CORS for GitHub Pages
app.use(cors({
  origin:'https://rohitsable123.github.io',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Mount routes
app.use('/auth', authRoutes);

// Root route for test
app.get('/', (req, res) => {
  res.send('🚀 Backend is live!');
});

// Start server (IMPORTANT: Railway needs process.env.PORT ONLY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

/******************/
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);


/******************/
const sellRoutes = require('./routes/sell');
app.use('/api/sell', sellRoutes);
app.use('/uploads', express.static('uploads'));
