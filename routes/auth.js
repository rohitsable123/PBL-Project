const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/signup', async (req, res) => {
  console.log('Signup route hit');
  console.log('Request body:', req.body);

  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (fullname, email, phone, password) VALUES (?, ?, ?, ?)',
      [fullname, email, phone, hashedPassword],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Email already exists');
          }
          return res.status(500).send('Database error');
        }
        res.send('Signup successful');
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

/**********************************************/

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, "your_secret", { expiresIn: "1d" });

  // Set the token in a cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,             
    sameSite: "None",          
  });

    req.session.user = {
      id: user.id,
      fullname: user.fullname,
      email: user.email
    };
    
    res.json({ message: 'Login successful', user: req.session.user });
  });
});


/*****************************************************/


router.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


/********************************************************/

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // clear session cookie (if used)
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    }); // clear JWT cookie
    res.json({ message: 'Logged out' });
  });
});


