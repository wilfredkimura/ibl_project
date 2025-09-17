const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// List albums (public) sorted by date desc, then id desc
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id,
              a.title,
              a.date,
              COALESCE(cnt.cnt, 0) AS photo_count,
              cov.picture_url AS cover_url
         FROM albums a
    LEFT JOIN (
           SELECT album_id, COUNT(*) AS cnt
             FROM gallery
            WHERE album_id IS NOT NULL
            GROUP BY album_id
         ) cnt ON cnt.album_id = a.id
    LEFT JOIN LATERAL (
           SELECT g.picture_url
             FROM gallery g
            WHERE g.album_id = a.id
            ORDER BY g.date DESC, g.id DESC
            LIMIT 1
         ) cov ON TRUE
        ORDER BY a.date DESC, a.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update album (admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const { title, date } = req.body;
    await db.query(
      "UPDATE albums SET title = COALESCE($1, title), date = COALESCE($2, date) WHERE id = $3",
      [title ?? null, date ?? null, req.params.id]
    );
    res.json({ msg: "Album updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create album (admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const result = await db.query(
      "INSERT INTO albums (title, date) VALUES ($1, COALESCE($2, NOW())) RETURNING id, title, date",
      [title, date || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete album (admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await db.query("DELETE FROM albums WHERE id = $1", [req.params.id]);
    res.json({ msg: "Album deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get images for an album (public)
router.get("/:id/images", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM gallery WHERE album_id = $1 ORDER BY date DESC, id DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
