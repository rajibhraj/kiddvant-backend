const express = require("express");
const router = express.Router();
const { getSiteConfig, updateSiteConfig } = require("../controllers/siteConfigController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// GET /api/site-config - Publicly fetch current operational state
router.get("/", getSiteConfig);

// PUT /api/site-config - Restricted to superSuperAdmin
router.put("/", protect, restrictTo("superSuperAdmin"), updateSiteConfig);

module.exports = router;
