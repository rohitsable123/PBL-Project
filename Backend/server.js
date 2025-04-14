const express = require('express');
const cors = require('cors'); // ✅ add this
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors()); // ✅ allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
