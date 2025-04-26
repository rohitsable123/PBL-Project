// routes/profile.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');

// For handling file uploads (profile pic upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get current user profile
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  db.query('SELECT fullname, email, phone, age, region, gender FROM users WHERE id = ?', [req.session.userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    if (results.length === 0) {
      return res.status(404).send('Profile not found');
    }
    res.json(results[0]);
  });
});

// Update user profile
router.post('/update', upload.single('profileImage'), (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { fullname, email, phone, age, region, gender } = req.body;
  const profileImage = req.file ? req.file.buffer : null;

  db.query(
    'UPDATE users SET fullname = ?, email = ?, phone = ?, age = ?, region = ?, gender = ?, profile_image = ? WHERE id = ?',
    [fullname, email, phone, age, region, gender, profileImage, req.session.userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.send('Profile updated');
    }
  );
});

module.exports = router;
