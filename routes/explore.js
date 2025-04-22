const express = require('express');
const router = express.Router();
const db = require('../db');

// GET route to fetch all books
router.get('/', (req, res) => {
  const sql = `SELECT id, name, author, user_price, grade, image_url FROM books ORDER BY listed_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(results);
  });
});

module.exports = router;
