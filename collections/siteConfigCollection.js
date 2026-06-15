const mongoose = require("mongoose");

const siteConfigSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["running", "development", "site_off"],
      default: "running",
    },
    alertTitle: {
      type: String,
      default: "System Maintenance",
    },
    alertMessage: {
      type: String,
      default: "We are currently updating our website. Please check back later.",
    },
    maintenanceDescription: {
      type: String,
      default: "The site is temporarily offline for scheduled upgrades.",
    },
    ctaText: {
      type: String,
      default: "Retry",
    },
  },
  {
    timestamps: true,
    strict: false, // Allows future extensible configuration fields
  }
);

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

module.exports = SiteConfig;
