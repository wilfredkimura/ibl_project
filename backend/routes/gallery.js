const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

// Public get
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM gallery");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
router.post("/", auth, admin, upload.single("picture"), async (req, res) => {
  const { caption } = req.body;
  const picture_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.query(
      "INSERT INTO gallery (picture_url, caption, date) VALUES ($1, $2, NOW())",
      [picture_url, caption]
    );
    res.json({ msg: "Image added to gallery" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM gallery WHERE id = $1", [req.params.id]);
    res.json({ msg: "Image deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
