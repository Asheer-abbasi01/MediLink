// routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", register);

// POST /api/auth/login
router.post("/login", login);

export default router;
