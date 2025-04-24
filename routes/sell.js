const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reread_books', // optional folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
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
  grade,
  conditions
} = req.body;


  const imageUrl = req.file.path; 
  const sql = `
    INSERT INTO books (user_id, name, author, original_price, user_price, grade, conditions, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, bookName, bookAuthor, originalPrice, userPrice, grade, conditions, imageUrl], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to list book' });
    }
    res.json({ success: true, message: 'Book listed successfully' });
  });
});

module.exports = router;
