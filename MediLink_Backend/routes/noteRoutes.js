import express from "express";
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    getNoteStats
} from "../controllers/noteController.js";

const router = express.Router();

// Note: Authentication middleware should be added here if available
// For now, we'll rely on headers for user identification

// Statistics route (must be before /:id route)
router.get("/stats", getNoteStats);

// CRUD routes
router.route("/")
    .get(getAllNotes)
    .post(createNote);

router.route("/:id")
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

export default router;
