const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// GET    /api/products       - get all products
// POST   /api/products       - create a product
router.route("/").get(getAllProducts).post(createProduct);

// GET    /api/products/:id   - get single product
// PUT    /api/products/:id   - update product
// DELETE /api/products/:id   - delete product
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
