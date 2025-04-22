const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all listed books
router.get("/", (req, res) => {
  const query = "SELECT id, title, author, price, image FROM books";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

module.exports = router;
