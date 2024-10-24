const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = Schema({
    label: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    quantity: { type: String },
    subcategory: { type: Schema.Types.ObjectId, ref: "subcategories" },
    category: { type: Schema.Types.ObjectId, ref: "categories" }
})

module.exports = model("products", ProductSchema);
