import Note from "../models/Note.js";

// @desc    Get all notes (admin gets all, user gets only their notes)
// @route   GET /api/notes
// @access  Private
export const getAllNotes = async (req, res) => {
    try {
        const userRole = req.user?.role || req.headers["x-user-role"];
        const userId = req.user?.id || req.headers["x-user-id"];

        let query = { status: { $ne: "deleted" } };

        // If user is not admin, only show their notes
        if (userRole !== "admin") {
            query.createdBy = userId;
        }

        // Apply filters from query params
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const notes = await Note.find(query)
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
            error: error.message
        });
    }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).populate("createdBy", "username email");

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user has permission to view this note
        const userRole = req.user?.role || req.headers["x-user-role"];
        const userId = req.user?.id || req.headers["x-user-id"];

        if (userRole !== "admin" && note.createdBy._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this note"
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch note",
            error: error.message
        });
    }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
    try {
        const userId = req.user?.id || req.headers["x-user-id"];

        const noteData = {
            ...req.body,
            createdBy: userId
        };

        const note = await Note.create(noteData);

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(400).json({
            success: false,
            message: "Failed to create note",
            error: error.message
        });
    }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user has permission to update this note
        const userRole = req.user?.role || req.headers["x-user-role"];
        const userId = req.user?.id || req.headers["x-user-id"];

        if (userRole !== "admin" && note.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this note"
            });
        }

        // Update note
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("createdBy", "username email");

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(400).json({
            success: false,
            message: "Failed to update note",
            error: error.message
        });
    }
};

// @desc    Delete note (soft delete)
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user has permission to delete this note
        const userRole = req.user?.role || req.headers["x-user-role"];
        const userId = req.user?.id || req.headers["x-user-id"];

        if (userRole !== "admin" && note.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this note"
            });
        }

        // Soft delete
        note.status = "deleted";
        await note.save();

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message
        });
    }
};

// @desc    Get notes statistics
// @route   GET /api/notes/stats
// @access  Private (Admin only)
export const getNoteStats = async (req, res) => {
    try {
        const userRole = req.user?.role || req.headers["x-user-role"];

        if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view statistics"
            });
        }

        const stats = await Note.aggregate([
            { $match: { status: { $ne: "deleted" } } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalNotes = await Note.countDocuments({ status: { $ne: "deleted" } });
        const priorityStats = await Note.aggregate([
            { $match: { status: { $ne: "deleted" } } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total: totalNotes,
                byCategory: stats,
                byPriority: priorityStats
            }
        });
    } catch (error) {
        console.error("Error fetching note stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message
        });
    }
};
