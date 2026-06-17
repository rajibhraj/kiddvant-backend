const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  subscribeNewsletter,
  getContacts,
  getSubscribers,
  updateContactStatus,
  deleteContact,
  deleteSubscriber,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/", submitContactForm);
router.post("/subscribe", subscribeNewsletter);

// Protected routes (Admin only)
router.get("/", protect, getContacts);
router.get("/subscribers", protect, getSubscribers);
router.put("/:id/status", protect, updateContactStatus);
router.delete("/:id", protect, deleteContact);
router.delete("/subscribers/:id", protect, deleteSubscriber);

module.exports = router;
