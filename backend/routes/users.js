const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

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

// Admin: list all users with admin flag
router.get("/", auth, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name AS username, email, is_admin FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Admin: toggle admin status
router.put("/:id/toggle-admin", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query("SELECT is_admin FROM users WHERE id = $1", [id]);
    if (current.rows.length === 0) return res.status(404).json({ message: "User not found" });
    const newVal = !current.rows[0].is_admin;
    await pool.query("UPDATE users SET is_admin = $1 WHERE id = $2", [newVal, id]);
    res.json({ message: "Admin status updated", is_admin: newVal });
  } catch (err) {
    console.error("Error toggling admin:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Admin: delete user
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err.stack);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
