const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// Get cart items
router.get("/", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  db.query("SELECT * FROM cart WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});

// Add/update item
router.post("/", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const { book_title, book_price, book_image, quantity } = req.body;

  const sql = `
    INSERT INTO cart (user_id, book_title, book_price, book_image, quantity)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(
    sql,
    [userId, book_title, book_price, book_image, quantity],
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ success: true });
    }
  );
});

// Remove item
router.delete("/:id", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const itemId = req.params.id;

  db.query(
    "DELETE FROM cart WHERE id = ? AND user_id = ?",
    [itemId, userId],
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ success: true });
    }
  );
});

module.exports = router;
