const Category = require("../model/category");

const create = async (req, res, next) => {
    try {
        const { label, description, link } = req.body;

        const category = new Category({ label, description, link });

        await category.save();

        res.json({ message: 'Category created successfully' }).status(200);
    } catch (error) {
        res.json({ message: "Category does not created", error: error?.message })
    }
}

const getAll = async (req, res, next) => {
    try {
        const categories = await Category.find({}, { _id: 1, label: 1, description: 1 });

        res.json({ data: categories })
    } catch (error) {
        res.json({ message: "Category get all failed", error: error?.message })
    }
}

const getAllWithSubCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}, { _id: 1, label: 1, description: 1, subcategories: 1 }).populate({ path: "subcategories", select: 'id label link category' });

        res.json({ data: categories })
    } catch (error) {
        res.json({ message: "Category get all failed", error: error?.message })
    }
}

const getCategories_Subcategories_products = async (req, res, next) => {
    try {
        const categories = await Category.find(
            {},
            { _id: 1, label: 1, description: 1 }
        )
        .populate({ path: "subcategories", select: "_id label link description", populate: { path: "products",select:"_id label price image" } })
        // const categories = await Category.find({}, { _id: 1, label: 1, description: 1 }).populate({ path: "subcategories", select: "_id label link description category" }).populate({ path: "products", select: "_id label price image" });
        res.json({ data: categories })
    } catch (error) {
        res.json({ message: "Failed to fetch categories with sub categories with products", error: error?.message })
    }

}

module.exports = { create, getAll, getAllWithSubCategories, getCategories_Subcategories_products }