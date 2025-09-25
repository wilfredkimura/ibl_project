const cloudinary = require('cloudinary').v2;

// Configure from CLOUDINARY_URL or individual env vars
// CLOUDINARY_URL format: cloudinary://<api_key>:<api_secret>@<cloud_name>
cloudinary.config({
  cloud_name: process.env.dl7gcyjbx,
  api_key: process.env.259261594318917,
  api_secret: process.env.BVNWhYHXc6NJ7ElVihvm11L0_yg,
  secure: true,
});

module.exports = cloudinary;
