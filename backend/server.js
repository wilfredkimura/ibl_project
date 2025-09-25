require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./db");
const os = require("os");

const app = express();
app.use(cors());
app.use(express.json());
// Ensure uploads directory exists (Render's FS starts empty on each deploy)
const uploadsDir = path.join(__dirname, "uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.error("Failed to create uploads directory:", e);
}
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/albums", require("./routes/albums"));
app.use("/api/leaders", require("./routes/leaders"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/events", require("./routes/events"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/users", require("./routes/users"));

// Lightweight health check (and DB check)
app.get("/api/health", async (req, res) => {
  try {
    const now = await db.query("SELECT NOW() as now");
    res.json({ ok: true, now: now.rows?.[0]?.now });
  } catch (err) {
    console.error("[health] DB check failed:", err.stack || err);
    res.status(500).json({ ok: false, error: "DB check failed" });
  }
});

// Optional: apply schema at boot if AUTO_MIGRATE is enabled (default true in production)
async function applySchemaAtBoot() {
  const shouldMigrate = process.env.AUTO_MIGRATE === '1' || (process.env.NODE_ENV === 'production' && process.env.AUTO_MIGRATE !== '0');
  if (!shouldMigrate) return;
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    if (!sql || !sql.trim()) {
      console.warn('[boot-migrate] schema.sql empty, skipping');
      return;
    }
    console.log('[boot-migrate] applying schema…', { file: schemaPath, length: sql.length, host: os.hostname() });
    await db.query(sql);
    console.log('[boot-migrate] done');
  } catch (e) {
    console.error('[boot-migrate] failed:', e.stack || e);
  }
}

const PORT = process.env.PORT || 5000;
// Add this to server.js before the app.listen() call
if (process.env.NODE_ENV === 'production') {
  // Determine where the frontend build exists at runtime
  const distCandidates = [
    path.join(__dirname, '../frontend/dist'), // monorepo path
    path.join(__dirname, 'dist'),             // copied into backend at build
    process.env.FRONTEND_DIST && path.isAbsolute(process.env.FRONTEND_DIST)
      ? process.env.FRONTEND_DIST
      : null,
  ].filter(Boolean);

  const existingDist = distCandidates.find((p) => {
    try { return fs.existsSync(path.join(p, 'index.html')); } catch { return false; }
  });

  if (existingDist) {
    app.use(express.static(existingDist));

    // Handle React routing for non-API routes (Express 5 compatible)
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(existingDist, 'index.html'));
    });
  } else {
    console.warn('[server] frontend build not found; skipping static serving');
  }
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
