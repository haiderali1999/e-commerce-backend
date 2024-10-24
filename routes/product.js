const express = require("express");
const router = express.Router();
const { createProduct, products, productWithCategoryAndSubCategory, productPagination, productSearch } = require("../controller/product");

router.get('/', products)
router.get('/details', productWithCategoryAndSubCategory)
router.get('/pagination', productPagination)
router.post('/search', productSearch)
router.post('/', createProduct);

module.exports = router