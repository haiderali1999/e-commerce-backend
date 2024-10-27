const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const validObject = (object = {}, keys = [], res) => {
  const result = {};
  let valid = true;
  for (let key of keys) {
    if (!object[key]) {
      result[key] = "Field is required";
      valid = false;
    }
  }
  if (!valid) res.json({ missing_keys: result });
};

const delKeys = (obj, keys) => {
  const result = { ...obj };
  for (let key of keys) {
    delete result[key];
  }
  return result;
};

const hashPassword = async (password) => {
  const { salt } = process.env;

  return bcrypt.hash(password, +salt);
};

// Assume this is inside an async route handler in your Express app
const uploadToCloudinary = (req) => {
  return new Promise((resolve, reject) => {
    // Create the Cloudinary upload stream with desired options
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
        ],
      },
      (error, result) => {
        // Callback to handle the response from Cloudinary
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // Stream the buffer directly to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });
};

module.exports = { validObject, delKeys, hashPassword, uploadToCloudinary };
