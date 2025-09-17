const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/public", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, bio, picture_url FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching public users:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
