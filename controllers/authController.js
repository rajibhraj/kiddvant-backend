const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../collections/adminCollection");

const JWT_SECRET = process.env.JWT_SECRET || "kiddvant_super_secret_session_token_key";

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
};
