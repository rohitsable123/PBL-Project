const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/signup', async (req, res) => {
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
    res.status(500).send('Server error');
  }
});

module.exports = router;
