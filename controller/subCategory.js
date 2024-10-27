const Category = require("../model/category");
const SubCategory = require("../model/subCategory");
const ProductModel = require("../model/product");
const cloudinary = require("cloudinary").v2;

const createSubCategory = async (req, res, next) => {
  try {
    const { label, description, link, category } = req.body;

    const subCategory = new SubCategory({ label, description, link, category });

    const _subCategory = await subCategory.save();
    await Category.updateOne(
      { _id: category },
      { $push: { subcategories: _subCategory._id } }
    );
    res.json({ message: "Sub Category created successfully" }).status(200);
  } catch (error) {
    res.json({
      message: "SubCategory does not created",
      error: error?.message,
    });
  }
};

const getAll = async (req, res, next) => {
  try {
    const subcategories = await SubCategory.find(
      {},
      { _id: 1, label: 1, link: 1, description: 1 }
    );
    res.json({ data: subcategories });
  } catch (error) {
    res.json({
      message: "Failed to fetch sub categories",
      error: error?.message,
    });
  }
};

const getAllWithProducts = async (req, res, next) => {
  try {
    const subcategories = await SubCategory.find(
      {},
      { _id: 1, label: 1, link: 1, description: 1, products: 1 }
    ).populate({ path: "products", select: "_id label price image" });
    res.json({ data: subcategories });
  } catch (error) {
    res.json({
      message: "Failed to fetch sub categories with products",
      error: error?.message,
    });
  }
};

const deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.body;

    const result = await SubCategory.findOne({ _id: id }).populate({
      path: "products",
      select: "_id publicId",
    });
    const subCategory = result.toObject();

    if (!subCategory) return res.json({ message: "Subcategory not found" });
    const productIds = [];
    const imagePublicIds = [];

    subCategory.products.forEach((product) => {
      productIds.push(product?._id);
      imagePublicIds.push(product?.publicId);
    });

    const p1 = cloudinary.api.delete_resources(imagePublicIds);
    const p2 = ProductModel.deleteMany({ _id: { $in: productIds } });
    const p3 = SubCategory.deleteOne({ _id: id });

    const del = await Promise.all([p1, p2, p3]);

    res.json({ message: "subcategory deleted successfully" });
  } catch (error) {
    res.json({ message: error?.message || "subcategory not deleted" });
  }
};

module.exports = {
  createSubCategory,
  getAll,
  getAllWithProducts,
  deleteSubcategory,
};
