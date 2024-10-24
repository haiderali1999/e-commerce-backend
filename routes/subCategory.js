const { Router } = require("express");
const { createSubCategory, getAll, getAllWithProducts } = require("../controller/subCategory");
const router = Router();

router.get("/", getAll)
router.get("/products", getAllWithProducts)
router.post("/", createSubCategory)

module.exports = router;