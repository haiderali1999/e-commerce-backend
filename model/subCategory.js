const { Schema, model } = require("mongoose");

const subCategory = Schema({
    label: { type: String, required: true, unique: true },
    link: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "categories", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "products" }]
})

module.exports = model('subcategories', subCategory)