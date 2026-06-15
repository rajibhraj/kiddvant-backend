const Order = require("../collections/orderCollection");
const Product = require("../collections/productCollection");

// Generate unique orderId like KV-ORD-00001
const generateOrderId = async () => {
  const last = await Order.findOne({}, { orderId: 1 })
    .sort({ createdAt: -1 })
    .lean();

  if (!last || !last.orderId) return "KV-ORD-00001";

  const parts = last.orderId.split("-");
  const lastNumStr = parts[2];
  const num = parseInt(lastNumStr, 10);
  const next = String(num + 1).padStart(5, "0");
  return `KV-ORD-${next}`;
};

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      shippingCost,
      subtotal,
      total,
      notes,
    } = req.body;

    // Basic validation
    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone) {
      return res.status(400).json({ success: false, message: "Customer name and phone are required" });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: "Shipping address and city are required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    const orderId = await generateOrderId();

    // Map and construct order items
    const orderItems = [];
    for (const item of items) {
      // Find the product in the database if possible to link it
      let dbProduct = null;
      if (item._id) {
        dbProduct = await Product.findById(item._id);
      } else if (item.productId) {
        dbProduct = await Product.findOne({ productId: item.productId });
      }

      orderItems.push({
        product: dbProduct ? dbProduct._id : undefined,
        productId: item.productId || (dbProduct ? dbProduct.productId : "UNKNOWN"),
        name: item.name || item.product_name,
        price: item.price || item.price_bdt,
        quantity: item.quantity,
        image: item.image || item.product_image || "",
      });

      // Update product stock if found
      if (dbProduct) {
        const newStock = Math.max(0, dbProduct.stock - item.quantity);
        await Product.findByIdAndUpdate(dbProduct._id, { stock: newStock });
      }
    }

    // Create the order
    const order = await Order.create({
      orderId,
      customerInfo,
      shippingAddress,
      items: orderItems,
      paymentMethod: paymentMethod || "cod",
      shippingCost: shippingCost || 0,
      subtotal,
      total,
      notes: notes || "",
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by orderId or database _id
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    let order = await Order.findOne({ orderId: req.params.id }).populate("items.product");
    if (!order) {
      // Try by Mongoose ObjectId
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(req.params.id).populate("items.product");
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    let order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!order && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
