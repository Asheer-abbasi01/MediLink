import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Note title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"]
        },
        content: {
            type: String,
            required: [true, "Note content is required"],
            trim: true
        },
        category: {
            type: String,
            enum: ["patient", "doctor", "appointment", "general", "medical", "reminder", "symptom", "medication"],
            default: "general"
        },
        relatedTo: {
            type: String,
            trim: true,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isPrivate: {
            type: Boolean,
            default: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },
        tags: [{
            type: String,
            trim: true
        }],
        status: {
            type: String,
            enum: ["active", "archived", "deleted"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
noteSchema.index({ createdBy: 1, status: 1 });
noteSchema.index({ category: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
