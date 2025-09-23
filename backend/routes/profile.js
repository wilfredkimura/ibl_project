const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images are allowed"));
  },
});

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, bio, picture_url, is_admin FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, bio, picture_url, is_admin FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.put("/", [auth, upload.single("picture")], async (req, res) => {
  try {
    const { name, bio } = req.body;
    const picture_url = req.file ? `/uploads/${req.file.filename}` : null;
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updateFields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (bio) {
      updateFields.push(`bio = $${paramIndex++}`);
      values.push(bio);
    }
    if (picture_url) {
      updateFields.push(`picture_url = $${paramIndex++}`);
      values.push(picture_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(req.user.id);
    const query = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE id = $${paramIndex} RETURNING id, name, email, bio, picture_url, is_admin`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating profile:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
