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
  origin:['https://rohitsable123.github.io', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'a0e668f5088ee0e1c96addd08a24f50c3ec174f223a7a072603b83d3731fcb98f80f18b85120461dd70ff60fd996a5a3033bbeccf15d6bd51edb91d81d8ff020',
  resave: false,
  saveUninitialized: false
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
