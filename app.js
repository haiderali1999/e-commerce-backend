const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const { main } = require("./db/db");
const { upload } = require("./multer/index");
const { cloudinaryInit } = require("./cloudinary/init");

// cors config
const corsOptions = {
  origin: [process.env.origin1, process.env.origin2], // Allow only this domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these methods
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const subCategoriesRouter = require("./routes/subCategory");
const { userAuthentication } = require("./middleware/auth");

const app = express();

// db connection
main();

// cloudinary init
cloudinaryInit();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// middlewares
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", upload.single("image"), productRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoriesRouter);

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
