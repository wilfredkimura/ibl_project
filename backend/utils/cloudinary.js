const fs = require('fs');
const path = require('path');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function uploadBuffer(file, folder = 'ibl_project') {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      // file.originalname is usually available from multer
      const ext = path.extname(file.originalname || "image.jpg");
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFile(filepath, file.buffer, (err) => {
        if (err) return reject(err);

        // Return result matching Cloudinary's response structure
        // secure_url is what the backend expects
        const localUrl = `/uploads/${filename}`;
        resolve({
          secure_url: localUrl,
          public_id: filename
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { uploadBuffer };
