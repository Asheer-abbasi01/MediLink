import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/ai/chat
// Optional: we can add protect middleware if we only want authenticated users to chat with AI
router.post("/chat", chatWithAI);

export default router;
