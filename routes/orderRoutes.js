const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

// POST /api/orders       - Place a new order
// GET  /api/orders       - Get all orders
router.route("/").post(createOrder).get(getAllOrders);

// GET /api/orders/:id          - Get order details
// PUT /api/orders/:id/status   - Update order status/payment
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;
