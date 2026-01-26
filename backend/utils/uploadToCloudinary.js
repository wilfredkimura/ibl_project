const fs = require('fs');
const path = require('path');

// Ensure uploads folder exists (relative to this file in utils/ -> ../uploads)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function uploadBuffer(file, folder = 'ibl_project') {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const ext = path.extname(file.originalname || "image.jpg");
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFile(filepath, file.buffer, (err) => {
        if (err) return reject(err);

        // Return result matching the structure expected by the backend
        // secure_url is used to save to DB
        // The server.js serves /uploads statically
        resolve({
          secure_url: `/uploads/${filename}`,
          public_id: filename
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { uploadBuffer };
