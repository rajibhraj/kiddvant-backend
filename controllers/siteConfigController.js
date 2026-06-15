const SiteConfig = require("../collections/siteConfigCollection");

// @desc    Get site configuration
// @route   GET /api/site-config
const getSiteConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({
        active: true,
        status: "running",
        alertTitle: "System Maintenance",
        alertMessage: "We are currently updating our website. Please check back later.",
        maintenanceDescription: "The site is temporarily offline for scheduled upgrades.",
        ctaText: "Retry",
      });
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site configuration
// @route   PUT /api/site-config
const updateSiteConfig = async (req, res) => {
  try {
    // Find the single configuration document or create it if not present
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(req.body);
    } else {
      // Clean up body properties to prevent overriding _id or __v if passed
      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.__v;

      config = await SiteConfig.findByIdAndUpdate(
        config._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSiteConfig,
  updateSiteConfig,
};
