const { Router } = require('express');
const { create, getAll, getAllWithSubCategories, getCategories_Subcategories_products } = require('../controller/category');
const router = Router();

router.get('/',getAll)
router.get('/subcategories',getAllWithSubCategories)
router.get('/subcategories/products',getCategories_Subcategories_products)
router.post("/", create)

module.exports = router