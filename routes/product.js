const express = require("express");
const router = express.Router();
const {
  createProduct,
  products,
  productWithCategoryAndSubCategory,
  productPagination,
  productSearch,
  deleteProduct,
  updateProduct,
} = require("../controller/product");

router.get("/", products);
router.get("/details", productWithCategoryAndSubCategory);
router.get("/pagination", productPagination);
router.post("/search", productSearch);
router.post("/", createProduct);
router.delete("/", deleteProduct);
router.put("/", updateProduct);

module.exports = router;
