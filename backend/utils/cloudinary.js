const cloudinary = require('cloudinary').v2;

// Require a single CLOUDINARY_URL for configuration.
// Format: cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
if (!process.env.CLOUDINARY_URL) {
  throw new Error(
    'CLOUDINARY_URL is not set. Please configure CLOUDINARY_URL in your Render environment as cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>'
  );
}

// The Cloudinary SDK will auto-read CLOUDINARY_URL from process.env.
// We only enforce secure URLs.
cloudinary.config({ secure: true });

module.exports = cloudinary;
