const { Router } = require("express");
const {
  createSubCategory,
  getAll,
  getAllWithProducts,
  deleteSubcategory,
} = require("../controller/subCategory");
const router = Router();

router.get("/", getAll);
router.get("/products", getAllWithProducts);
router.post("/", createSubCategory);
router.delete("/", deleteSubcategory);

module.exports = router;
