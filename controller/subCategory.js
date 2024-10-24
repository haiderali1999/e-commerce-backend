const Category = require('../model/category')
const SubCategory = require("../model/subCategory");

const createSubCategory = async (req, res, next) => {
    try {

        const { label, description, link, category } = req.body;

        const subCategory = new SubCategory({ label, description, link, category });

        const _subCategory = await subCategory.save();
        await Category.updateOne({ _id: category }, { $push: { subcategories: _subCategory._id } })
        res.json({ message: "Sub Category created successfully" }).status(200)
    } catch (error) {
        res.json({ message: "SubCategory does not created", error: error?.message })
    }
}

const getAll = async (req, res, next) => {
    try {
        const subcategories = await SubCategory.find({}, { _id: 1, label: 1, link: 1, description: 1 })
        res.json({ data: subcategories })
    } catch (error) {
        res.json({ message: "Failed to fetch sub categories", error: error?.message })
    }
}

const getAllWithProducts = async (req, res, next) => {
    try {
        const subcategories = await SubCategory.find({}, { _id: 1, label: 1, link: 1, description: 1, products: 1 }).populate({ path: "products" ,select:"_id label price image"})
        res.json({ data: subcategories })
    } catch (error) {
        res.json({ message: "Failed to fetch sub categories with products", error: error?.message })
    }
}



module.exports = { createSubCategory, getAll, getAllWithProducts }