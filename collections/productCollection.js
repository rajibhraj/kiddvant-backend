const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  size: { type: String, default: "" },       // e.g. "S", "M", "L", "XL"
  color: { type: String, default: "" },      // e.g. "Red", "Blue"
  sku: { type: String, default: "" },        // unique variant identifier
  stock: { type: Number, default: 0, min: 0 },
  additionalPrice: { type: Number, default: 0 }, // extra cost on top of base price
});

const productSchema = new mongoose.Schema(
  {
    // ── Unique Product ID ───────────────────────────────────
    productId: {
      type: String,
      unique: true,
      trim: true,
    },

    // ── Basic Info ──────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,   // allows multiple docs without a slug
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Categorization ──────────────────────────────────────
    category: {
      type: String,
      trim: true,
      default: "Uncategorized",
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },

    // ── Pricing ─────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currency: {
      type: String,
      default: "USD",
    },

    // ── Inventory ───────────────────────────────────────────
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    // ── Variants (size, color, etc.) ────────────────────────
    variants: {
      type: [variantSchema],
      default: [],
    },

    // ── Media ───────────────────────────────────────────────
    thumbnail: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },

    // ── Shipping ────────────────────────────────────────────
    weight: {
      type: Number,   // in kg
      default: 0,
    },
    dimensions: {
      length: { type: Number, default: 0 },  // cm
      width:  { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    isFreeShipping: {
      type: Boolean,
      default: false,
    },

    // ── Ratings & Reviews ───────────────────────────────────
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count:   { type: Number, default: 0 },
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // ── SEO ─────────────────────────────────────────────────
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: [String],
      default: [],
    },

    // ── Status ──────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
