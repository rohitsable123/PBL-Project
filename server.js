const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname)));

// Middleware

app.use(cors({
  origin: 'https://rohitsable123.github.io',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 Backend is live!');
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
