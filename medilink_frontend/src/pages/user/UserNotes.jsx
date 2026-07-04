import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

const UserNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [toast, setToast] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "general",
        priority: "medium",
        tags: ""
    });

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem("userId") || "";
                let url = "/api/notes";

                if (filterCategory !== "all") {
                    url += `?category=${filterCategory}`;
                }

                const response = await client.get(url, {
                    headers: {
                        "x-user-role": "user",
                        "x-user-id": userId
                    }
                });

                setNotes(response.data.data || response.data || []);
            } catch (error) {
                console.error("Error fetching notes:", error);
                showToast("Failed to fetch notes", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [filterCategory, refreshTrigger, showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const userId = localStorage.getItem("userId") || "";
            const noteData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
                isPrivate: true
            };

            if (editingNote) {
                await client.put(`/api/notes/${editingNote._id}`, noteData, {
                    headers: {
                        "x-user-role": "user",
                        "x-user-id": userId
                    }
                });
                showToast("Note updated successfully!");
            } else {
                await client.post("/api/notes", noteData, {
                    headers: {
                        "x-user-role": "user",
                        "x-user-id": userId
                    }
                });
                showToast("Note created successfully!");
            }

            setShowModal(false);
            resetForm();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error saving note:", error);
            showToast("Failed to save note", "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            const userId = localStorage.getItem("userId") || "";
            await client.delete(`/api/notes/${id}`, {
                headers: {
                    "x-user-role": "user",
                    "x-user-id": userId
                }
            });
            showToast("Note deleted successfully!");
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting note:", error);
            showToast("Failed to delete note", "error");
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            category: note.category || "general",
            priority: note.priority || "medium",
            tags: note.tags ? note.tags.join(", ") : ""
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            category: "general",
            priority: "medium",
            tags: ""
        });
        setEditingNote(null);
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case "urgent": return "danger";
            case "high": return "warning";
            case "medium": return "info";
            case "low": return "success";
            default: return "neutral";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "symptom": return "🩺";
            case "medication": return "💊";
            case "appointment": return "📅";
            case "reminder": return "⏰";
            case "medical": return "🏥";
            default: return "📝";
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {toast && (
                <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Medical Journal</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Keep private records of symptoms, medications, or reminders</p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/10 flex items-center gap-1"
                >
                    + Add New Note
                </Button>
            </div>

            {/* Filters Bar */}
            <Card title="Category Filter" subtitle="Narrow down your notes by health concern categories">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                        <option value="all">All Categories</option>
                        <option value="symptom">Symptoms 🩺</option>
                        <option value="medication">Medications 💊</option>
                        <option value="appointment">Appointments 📅</option>
                        <option value="reminder">Reminders ⏰</option>
                        <option value="medical">Medical 🏥</option>
                        <option value="general">General 📝</option>
                    </select>
                </div>
            </Card>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-pulse rounded-2xl h-44 bg-slate-200" />
                    <div className="animate-pulse rounded-2xl h-44 bg-slate-200" />
                </div>
            ) : notes.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm max-w-lg mx-auto">
                    <span className="text-5xl block mb-3">📝</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Journal Notes Found</h3>
                    <p className="text-xs font-semibold text-slate-400 mb-6">Document your symptoms, allergy reactions, or clinical instructions.</p>
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        Create Note
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                    {notes.map((note) => (
                        <Card 
                          key={note._id}
                          className="hover:shadow-md transition-all duration-200 border-l-4 border-l-teal-500"
                          bodyClass="p-6 flex flex-col justify-between h-full space-y-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{getCategoryIcon(note.category)}</span>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                {note.category}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant={getPriorityBadgeVariant(note.priority)} size="xs">
                                        {note.priority}
                                    </Badge>
                                </div>

                                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                                    {note.title}
                                </h3>

                                <p className="text-slate-500 text-xs font-semibold leading-relaxed whitespace-pre-wrap line-clamp-4">
                                    {note.content}
                                </p>

                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {note.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-505 rounded border border-slate-100"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold">
                                <span>
                                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-teal-600 hover:bg-teal-50 !px-2.5 !py-1 text-[10px]"
                                        onClick={() => handleEdit(note)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-rose-600 hover:bg-rose-50 !px-2.5 !py-1 text-[10px]"
                                        onClick={() => handleDelete(note._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingNote ? "Modify Note Details" : "Record Clinical Journal Note"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Note Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Blood pressure log"
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Detailed Message *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows="5"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                            placeholder="Write down your medical readings, instructions, or symptom descriptions..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-semibold text-slate-700">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            >
                                <option value="general">General</option>
                                <option value="symptom">Symptom</option>
                                <option value="medication">Medication</option>
                                <option value="appointment">Appointment</option>
                                <option value="reminder">Reminder</option>
                                <option value="medical">Medical</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-semibold text-slate-700">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Tags (comma-separated)"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., doctor, symptoms, critical"
                    />

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <Button type="submit" loading={formLoading} className="flex-1">
                            {editingNote ? "Update Journal Note" : "Save Journal Note"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserNotes;
