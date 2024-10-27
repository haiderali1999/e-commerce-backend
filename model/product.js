const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = Schema({
  label: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  image: String,
  publicId: String,
  description: String,
  quantity: String,
  subcategory: { type: Schema.Types.ObjectId, ref: "subcategories" },
  category: { type: Schema.Types.ObjectId, ref: "categories" },
});

ProductSchema.index({ label: "text" });

module.exports = model("products", ProductSchema);
