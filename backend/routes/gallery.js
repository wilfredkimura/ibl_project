const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

// Public get (optionally filter by album_id)
router.get("/", async (req, res) => {
  try {
    const { album_id } = req.query;
    let result;
    if (album_id) {
      result = await db.query(
        "SELECT * FROM gallery WHERE album_id = $1 ORDER BY date DESC, id DESC",
        [album_id]
      );
    } else {
      result = await db.query("SELECT * FROM gallery ORDER BY date DESC, id DESC");
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
router.post(
  "/",
  auth,
  admin,
  upload.fields([
    { name: "pictures" }, // multiple files
    { name: "picture", maxCount: 1 }, // backward compatibility
  ]),
  async (req, res) => {
    const { captions, caption, album_id } = req.body;
    // Gather files from either 'pictures' (array) or 'picture' (single)
    const files = (req.files?.pictures || []).concat(
      req.files?.picture ? [req.files.picture[0]] : []
    );
    if (!files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    try {
      // Normalize captions: allow array (captions), fallback to single caption
      let caps = [];
      if (Array.isArray(captions)) caps = captions;
      else if (typeof captions === "string") caps = [captions];
      else if (typeof caption === "string") caps = [caption];

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const picture_url = `/uploads/${f.filename}`;
        const thisCaption = caps[i] ?? caps[0] ?? null;
        await db.query(
          "INSERT INTO gallery (picture_url, caption, date, album_id) VALUES ($1, $2, NOW(), $3)",
          [picture_url, thisCaption, album_id || null]
        );
      }
      res.json({ msg: `Added ${files.length} image(s) to gallery` });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM gallery WHERE id = $1", [req.params.id]);
    res.json({ msg: "Image deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update gallery image (caption, album_id, optionally replace picture)
router.put(
  "/:id",
  auth,
  admin,
  upload.single("picture"),
  async (req, res) => {
    try {
      const { caption, album_id } = req.body;
      const picture_url = req.file ? `/uploads/${req.file.filename}` : null;
      await db.query(
        "UPDATE gallery SET caption = COALESCE($1, caption), album_id = COALESCE($2, album_id), picture_url = COALESCE($3, picture_url) WHERE id = $4",
        [caption ?? null, album_id ?? null, picture_url, req.params.id]
      );
      res.json({ msg: "Image updated" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
