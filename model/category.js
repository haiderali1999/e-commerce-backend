const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
    label: { type: String, required: true, unique: true },
    link: { type: String, required: true, unique: true },
    description: { type: String },
    subcategories: [
        { type: Schema.Types.ObjectId, ref: "subcategories" },
    ],
    // products: [
    //     { type: Schema.Types.ObjectId, ref: "products" },
    // ]
});

module.exports = model('categories', CategorySchema)