const express = require('express');
const router = express.Router();
const db = require('../db');

// GET route to fetch all books
router.get('/', (req, res) => {
  const sql = `SELECT id, fullname, author, user_price, grade, image_url FROM books ORDER BY listed_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const bookId = req.params.id;
const sql = `
  SELECT b.*, u.fullname AS owner_name, u.phone AS owner_phone 
  FROM books b 
  JOIN users u ON b.user_id = u.id 
  WHERE b.id = ?
`;

  db.query(sql, [bookId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(results[0]);
  });
});

module.exports = router;
