const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const { uploadBuffer } = require("../utils/uploadToCloudinary");

// Public get
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blogs ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("[blog] GET / error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
router.post("/", auth, admin, upload.single("picture"), async (req, res) => {
  const { title, content } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'blog');
      picture_url = up.secure_url;
    }
    await db.query(
      "INSERT INTO blogs (title, content, date, picture_url) VALUES ($1, $2, NOW(), $3)",
      [title, content, picture_url]
    );
    res.json({ msg: "Blog added" });
  } catch (err) {
    console.error("[blog] POST / error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, admin, upload.single("picture"), async (req, res) => {
  const { title, content } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'blog');
      picture_url = up.secure_url;
    }
    await db.query(
      "UPDATE blogs SET title = $1, content = $2, picture_url = COALESCE($3, picture_url) WHERE id = $4",
      [title, content, picture_url, req.params.id]
    );
    res.json({ msg: "Blog updated" });
  } catch (err) {
    console.error("[blog] PUT /:id error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM blogs WHERE id = $1", [req.params.id]);
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    console.error("[blog] DELETE /:id error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
