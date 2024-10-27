const { validObject, uploadToCloudinary } = require("../utils/utils");
const ProductModel = require("../model/product");
const SubCategory = require("../model/subCategory");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res, next) => {
  try {
    validObject(req.body, ["label", "price"], res);
    const { label, description, price, quantity, subcategory, category } =
      req.body;

    // const image = req.file.path;
    // Upload the image to Cloudinary
    // const uploadResult = await cloudinary.uploader.upload(image, {
    //   folder: "uploads", // Optional folder on Cloudinary
    // });
    // const url = cloudinary.url(uploadResult.public_id, {
    //   transformation: [
    //     { quality: "auto", fetch_format: "auto" },
    //     { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
    //   ],
    // });

    const result = await uploadToCloudinary(req);
  
    const product = ProductModel({
      label,
      description,
      image: result?.secure_url,
      publicId: result?.public_id,
      price: +price,
      quantity,
      subcategory,
      category,
    });

    const savedDoc = await product.save();

    await SubCategory.updateOne(
      { _id: subcategory },
      { $push: { products: savedDoc._id } }
    );

    res.json({ message: "Product created successfully" });
  } catch (error) {
    res.json({ message: error?.message || "Product does not create" });
  }
};

const products = async (req, res, next) => {
  try {
    const products = await ProductModel.find(
      {},
      { _id: 1, label: 1, description: 1, image: 1, price: 1 }
    );
    res.json({ data: products });
  } catch (error) {
    res.json({ message: error?.message || "products fetching failed" });
  }
};

const productWithCategoryAndSubCategory = async (req, res, next) => {
  try {
    const products = await ProductModel.find(
      {},
      {
        _id: 1,
        label: 1,
        description: 1,
        image: 1,
        price: 1,
        category: 1,
        subcategory: 1,
      }
    )
      .populate({ path: "category", select: "label" })
      .populate({ path: "subcategory", select: "label" });
    res.json({ data: products });
  } catch (error) {
    res.json({ message: error?.message || "products fetching failed" });
  }
};

const productPagination = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 1 } = req.query;
    const pages = (page - 1) * pageSize;
    const products = await ProductModel.find(
      {},
      { _id: 1, label: 1, price: 1, image: 1 }
    )
      .sort({ label: 1 })
      .limit(+pageSize)
      .skip(+pages);
    // project does not supported by mongoose
    // const products = await ProductModel.find().sort({ "label": 1 }).limit(pageSize).skip(pages).project({ _id: 1, label: 1, image: 1, price: 1 })
    const length = await ProductModel.find().countDocuments();
    res.json({
      data: products,
      pagination: {
        total: length,
        currentPage: +page,
        totalPages: Math.ceil(length / pageSize),
      },
    });
  } catch (error) {
    res.json({
      message: "Products fetching with pagination failed",
      error: error?.message,
    });
  }
};

const productSearch = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 1, search = "", filters = {} } = req.body;
    const skip = (page - 1) * pageSize;
    const products = await ProductModel.find({ $text: { $search: search } })
      .sort(filters)
      .limit(pageSize)
      .skip(skip)
      .populate({ path: "category", select: "label -_id" })
      .populate({ path: "subcategory", select: "label -_id" });
    const length = await ProductModel.countDocuments();
    res.json({
      data: products,
      pagination: { currentPage: page, pageSize, totalPages: length },
    });
  } catch (error) {
    res.status(404).json({
      message: "Product Search Failed",
      error: error?.messsage || "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.body;
  const product = await ProductModel.findOne({ _id: id });

  if (!product) return res.json({ message: "Product not found" });
  const imageSlices = product?.image?.split("/");
  const imageSlice = imageSlices[imageSlices.length - 1]?.split(".");
  const publicId = imageSlice[0];

  const deleteImage = cloudinary.uploader.destroy(publicId);

  const deleteItem = ProductModel.deleteOne({ _id: id });

  await Promise.all([deleteImage, deleteItem]);

  res.json({ message: "Product Deleted Successfully" });
};

const updateProduct = async (req, res, next) => {
  const { _id, label, description, price, quantity, subcategory, category } =
    req.body;
  const exist = ProductModel.findOne({ _id });

  if (!exist) return res.json({ message: "Product not found" });
  const image = req.file.path;
  const deleteImage = cloudinary.uploader.destroy(exist.image);
  const updateItem = ProductModel.updateOne(
    { _id },
    {
      $set: {
        label,
        description,
        price,
        quantity,
        subcategory,
        category,
        image,
      },
    }
  );
  await Promise.all([deleteImage, updateItem]);

  res.json({ message: "Product updated successfully" });
};

module.exports = {
  createProduct,
  products,
  productWithCategoryAndSubCategory,
  productPagination,
  productSearch,
  deleteProduct,
  updateProduct,
};
