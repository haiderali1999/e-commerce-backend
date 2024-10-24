var path = require("path");
const cors = require("cors");
var logger = require("morgan");
var multer = require("multer");
var express = require("express");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const { main } = require("./db/db");

const corsOptions = {
  origin: [process.env.origin1, process.env.origin2], // Allow only this domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these methods
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

// multer config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/uploads`)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null,file. uniqueSuffix + file.originalname)
//   }
// })

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinaryApiSecret, // Click 'View API Keys' above to copy your API secret
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "uploads", // folder name in Cloudinary
  allowed_formats: ["jpg", "png", "jpeg", "gif"],
});

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

// Initialize Multer with the Cloudinary storage
const upload = multer({ storage });

// routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/product");
var categoryRouter = require("./routes/category");
var subCategoriesRouter = require("./routes/subCategory");
const { userAuthentication } = require("./middleware/auth");

var app = express();

// db connection
main();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", userAuthentication, upload.single("image"), productRouter);
app.use("/category", userAuthentication, categoryRouter);
app.use("/subCategory", userAuthentication, subCategoriesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
