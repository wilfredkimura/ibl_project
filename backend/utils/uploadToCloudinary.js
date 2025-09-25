const cloudinary = require('./cloudinary');

function uploadBuffer(file, folder = 'ibl_project') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

module.exports = { uploadBuffer };
