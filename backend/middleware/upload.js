const multer = require("multer");
// Use memory storage so we can stream to Cloudinary (or other remote storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;
