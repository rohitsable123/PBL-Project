
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Middleware to ensure login
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

// POST route to list book
router.post('/', isAuthenticated, upload.single('bookImage'), (req, res) => {
  const userId = req.session.userId;
  const {
    bookName,
    bookAuthor,
    originalPrice,
    userPrice,
    grade
  } = req.body;

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const sql = `
    INSERT INTO books (user_id, name, author, original_price, user_price, grade, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, bookName, bookAuthor, originalPrice, userPrice, grade, imageUrl], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to list book' });
    }
    res.json({ success: true, message: 'Book listed successfully' });
  });
});

module.exports = router;
