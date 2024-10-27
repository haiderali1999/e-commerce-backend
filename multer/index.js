const multer = require("multer")
// multer config method 1
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/uploads`);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.uniqueSuffix + file.originalname);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB file size limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type"));
//     }
//   },
// });

// method 2 with cloudinary

// cloudinary.config({
//   cloud_name: process.env.cloudName,
//   api_key: process.env.cloudinaryApiKey,
//   api_secret: process.env.cloudinaryApiSecret, // Click 'View API Keys' above to copy your API secret
// });

// Set up Cloudinary storage for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: "uploads", // folder name in Cloudinary
//   allowed_formats: ["jpg", "png", "jpeg", "gif"],
// });

// Initialize Multer with the Cloudinary storage
// const upload = multer({ storage });

// 3rd method
// const upload = multer({ dest: "upload/" });

// 4th method it return buffer object
const upload = multer({ storage: multer.memoryStorage() });

module.exports = { upload };
