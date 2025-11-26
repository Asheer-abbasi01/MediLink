// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";

// // Signup
// export const register = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   if (!email || !password) return res.status(400).json({ message: "Missing fields" });

//   const existing = await User.findOne({ email });
//   if (existing) return res.status(409).json({ message: "Email taken" });

//   const hash = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hash, role: role || "user" });

//   const access = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
//   const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

//   res.json({ access, refresh, user: { id: user._id, email: user.email } });
// };

// // Login
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ message: "Missing fields" });

//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//   const access = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
//   const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

//   res.json({ access, refresh, user: { id: user._id, email: user.email } });
// };



import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Admin login limit
const MAX_ADMINS = 3;

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // If admin, check login limit
  if (user.role === "admin") {
    const loggedInAdmins = await User.countDocuments({ role: "admin", isLoggedIn: true });

    // Already logged in max 3 admins
    if (!user.isLoggedIn && loggedInAdmins >= MAX_ADMINS) {
      return res.status(403).json({ message: "Max 3 admins can be logged in simultaneously" });
    }

    // Mark admin as logged in
    user.isLoggedIn = true;
    await user.save();
  }

  const access = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

  res.json({ access, refresh, user: { id: user._id, email: user.email, role: user.role } });
};

// Logout
export const logout = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (user && user.role === "admin") {
    user.isLoggedIn = false;
    await user.save();
  }
  res.json({ message: "Logged out successfully" });
};

// Register only for users (admins are fixed)
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role === "admin") return res.status(403).json({ message: "Cannot register admin accounts" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email taken" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "user" });

  const access = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

  res.json({ access, refresh, user: { id: user._id, email: user.email, role: user.role } });
};
