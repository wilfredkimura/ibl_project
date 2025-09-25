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
    const result = await db.query("SELECT * FROM events ORDER BY date");
    res.json(result.rows);
  } catch (err) {
    console.error("[events] GET / error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
router.post("/", auth, admin, upload.single("picture"), async (req, res) => {
  const { title, description, date, is_future } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'events');
      picture_url = up.secure_url;
    }
    await db.query(
      "INSERT INTO events (title, description, date, picture_url, is_future) VALUES ($1, $2, $3, $4, $5)",
      [title, description, date, picture_url, is_future]
    );
    res.json({ msg: "Event added" });
  } catch (err) {
    console.error("[events] POST / error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, admin, upload.single("picture"), async (req, res) => {
  const { title, description, date, is_future } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'events');
      picture_url = up.secure_url;
    }
    await db.query(
      "UPDATE events SET title = $1, description = $2, date = $3, picture_url = COALESCE($4, picture_url), is_future = $5 WHERE id = $6",
      [title, description, date, picture_url, is_future, req.params.id]
    );
    res.json({ msg: "Event updated" });
  } catch (err) {
    console.error("[events] PUT /:id error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM events WHERE id = $1", [req.params.id]);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error("[events] DELETE /:id error:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
