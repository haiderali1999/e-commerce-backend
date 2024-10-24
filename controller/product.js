const { validObject } = require("../utils/utils");
const ProductModel = require("../model/product");
const SubCategory = require("../model/subCategory");

const createProduct = async (req, res, next) => {
    try {
        validObject(req.body, ["label", "price"], res)
        const { label, description, price, quantity, subcategory, category
        } = req.body;
        debugger
        console.log(req.file);
        // console.log(req.file.filename);
        const image = req.file.path;
        // const image = req?.file?.filename;
        const product = ProductModel({ label, description, image, price: +price, quantity, subcategory, category });

        const savedDoc = await product.save();

        await SubCategory.updateOne({ _id: subcategory }, { $push: { products: savedDoc._id } })
        // await Category.updateOne({ _id: category }, { $push: { products: savedDoc._id } })
        res.json({ message: "Product created successfully" })
    } catch (error) {
        res.json({ message: error?.message || "Product does not create" })
    }
}

const products = async (req, res, next) => {
    try {
        const products = await ProductModel.find({}, { _id: 1, label: 1, description: 1, image: 1, price: 1 });
        res.json({ data: products })
    }
    catch (error) {
        res.json({ message: error?.message || "products fetching failed" })
    }
}

const productWithCategoryAndSubCategory = async (req, res, next) => {
    try {
        const products = await ProductModel.find({}, { _id: 1, label: 1, description: 1, image: 1, price: 1, category: 1, subcategory: 1 }).populate({ path: "category", select: "label" }).populate({ path: "subcategory", select: "label" })
        res.json({ data: products })
    }
    catch (error) {
        res.json({ message: error?.message || "products fetching failed" })
    }
}

const productPagination = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 1 } = req.query
        const pages = (page - 1) * pageSize;
        const products = await ProductModel.find({}, { _id: 1, label: 1, price: 1, image: 1 }).sort({ label: 1 }).limit(+pageSize).skip(+pages);
        // project does not supported by mongoose
        // const products = await ProductModel.find().sort({ "label": 1 }).limit(pageSize).skip(pages).project({ _id: 1, label: 1, image: 1, price: 1 })
        const length = await ProductModel.find().countDocuments()
        res.json({ data: products, pagination: { total: length, currentPage: +page, totalPages: Math.ceil(length / pageSize) } })
    } catch (error) {
        res.json({ message: "Products fetching with pagination failed", error: error?.message })
    }
}

const productSearch = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 1, search = "", filters = {} } = req.body;
        const skip = (page - 1) * pageSize;
        const products = await ProductModel.find({ $text: { $search: search } }).sort(filters).limit(pageSize).skip(skip).populate({ path: "category", select: "label -_id" }).populate({ path: "subcategory", select: "label -_id" })
        const length = await ProductModel.countDocuments();
        res.json({ data: products, pagination: { currentPage: page, pageSize, totalPages: length } })
    } catch (error) {
        res.status(404).json({ message: "Product Search Failed", error: error?.messsage || "Something went wrong" })
    }
}


module.exports = { createProduct, products, productWithCategoryAndSubCategory, productPagination, productSearch }