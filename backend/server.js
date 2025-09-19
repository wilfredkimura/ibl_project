require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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

const PORT = process.env.PORT || 5000;
// Add this to server.js before the app.listen() call
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
