// const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

function cloudinaryInit() {
  cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudinaryApiKey,
    api_secret: process.env.cloudinaryApiSecret, // Click 'View API Keys' above to copy your API secret
  });
}

module.exports = { cloudinaryInit };
