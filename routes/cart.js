const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path based on your project

// Middleware to check session
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// GET cart items
router.get('/', isLoggedIn, (req, res) => {
  const userId = req.session.userId;
  db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// ADD item to cart
router.post('/', isLoggedIn, (req, res) => {
  const { book_title, book_price, book_image } = req.body;
  const userId = req.session.userId;
  
  const sql = 'INSERT INTO cart (user_id, book_title, book_price, book_image) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, book_title, book_price, book_image], (err, result) => {
    if (err) {
      console.error('Error adding to cart:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Item added to cart' });
  });
});

// REMOVE item from cart
router.delete('/:id', isLoggedIn, (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.session.userId;

  db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartItemId, userId], (err, result) => {
    if (err) {
      console.error('Error removing from cart:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

module.exports = router;
