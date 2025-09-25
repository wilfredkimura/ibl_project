const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadBuffer } = require("../utils/uploadToCloudinary");

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
    let picture_url = null;
    if (req.file) {
      const up = await uploadBuffer(req.file, 'profiles');
      picture_url = up.secure_url;
    }
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
