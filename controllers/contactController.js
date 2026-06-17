const Contact = require("../collections/contactCollection");
const Newsletter = require("../collections/newsletterCollection");

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, topic, message } = req.body;

    if (!name || !email || !topic || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, topic, and message",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      topic,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message received successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/contact/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find and upsert, ensuring active state
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { status: "active" } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscribed to newsletter successfully",
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/contact/subscribers
// @access  Private (Admin)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !["unread", "read", "replied", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact entry not found" });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact entry
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact entry not found" });
    }

    res.status(200).json({ success: true, message: "Contact message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Unsubscribe subscriber
// @route   DELETE /api/contact/subscribers/:id
// @access  Private (Admin)
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.status(200).json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContactForm,
  subscribeNewsletter,
  getContacts,
  getSubscribers,
  updateContactStatus,
  deleteContact,
  deleteSubscriber,
};
