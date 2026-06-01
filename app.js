const express = require("express");
const cors = require("cors");
const app = express();

// CORS — allow Next.js dev server and production frontend
app.use(
  cors({
    origin: [
      // '*'
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://192.168.50.130:3000",
      "http://192.168.50.130:3001",
      "http://192.168.50.130:3002",
      "http://192.168.50.130:3003",
      "http://192.168.50.130:3004",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/products", require("./routes/productRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Kiddvant API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(require("./middleware/errorHandler"));

module.exports = app;
