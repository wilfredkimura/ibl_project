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
    const result = await db.query("SELECT * FROM leaders");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
router.post("/", auth, admin, upload.single("picture"), async (req, res) => {
  const { name, position, bio } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'leaders');
      picture_url = up.secure_url;
    }
    await db.query(
      "INSERT INTO leaders (name, position, bio, picture_url) VALUES ($1, $2, $3, $4)",
      [name, position, bio, picture_url]
    );
    res.json({ msg: "Leader added" });
  } catch (err) {
    console.error('[leaders] POST / error:', err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, admin, upload.single("picture"), async (req, res) => {
  const { name, position, bio } = req.body;
  let picture_url = null;
  try {
    if (req.file) {
      const up = await uploadBuffer(req.file, 'leaders');
      picture_url = up.secure_url;
    }
    await db.query(
      "UPDATE leaders SET name = $1, position = $2, bio = $3, picture_url = COALESCE($4, picture_url) WHERE id = $5",
      [name, position, bio, picture_url, req.params.id]
    );
    res.json({ msg: "Leader updated" });
  } catch (err) {
    console.error('[leaders] PUT /:id error:', err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM leaders WHERE id = $1", [req.params.id]);
    res.json({ msg: "Leader deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
