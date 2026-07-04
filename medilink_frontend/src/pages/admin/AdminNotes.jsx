import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

const AdminNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "general",
        priority: "medium",
        tags: "",
        relatedTo: "",
        isPrivate: false
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    useEffect(() => {
        fetchNotes();
    }, [filterCategory, filterPriority]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId") || "";
            
            const params = new URLSearchParams();
            if (filterCategory !== "all") params.append("category", filterCategory);
            if (filterPriority !== "all") params.append("priority", filterPriority);

            let url = "/api/notes";
            if (params.toString()) url += `?${params.toString()}`;

            const response = await client.get(url, {
                headers: {
                    "x-user-role": "admin",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const userId = localStorage.getItem("userId") || "";
            const noteData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : []
            };

            if (editingNote) {
                await client.put(`/api/notes/${editingNote._id}`, noteData, {
                    headers: {
                        "x-user-role": "admin",
                        "x-user-id": userId
                    }
                });
                showToast("Note updated successfully!");
            } else {
                await client.post("/api/notes", noteData, {
                    headers: {
                        "x-user-role": "admin",
                        "x-user-id": userId
                    }
                });
                showToast("Note created successfully!");
            }

            setShowModal(false);
            resetForm();
            fetchNotes();
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
                    "x-user-role": "admin",
                    "x-user-id": userId
                }
            });
            showToast("Note deleted successfully!");
            fetchNotes();
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
            tags: note.tags ? note.tags.join(", ") : "",
            relatedTo: note.relatedTo || "",
            isPrivate: note.isPrivate || false
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            category: "general",
            priority: "medium",
            tags: "",
            relatedTo: "",
            isPrivate: false
        });
        setEditingNote(null);
    };

    const filteredNotes = Array.isArray(notes) ? notes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    }) : [];

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
            case "patient": return "👤";
            case "doctor": return "👨‍⚕️";
            case "appointment": return "📅";
            case "medical": return "🏥";
            case "reminder": return "⏰";
            case "symptom": return "🩺";
            case "medication": return "💊";
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
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical & Staff Notes</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Keep track of diagnoses, internal medical alerts, and task reminders</p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/10 flex items-center gap-1"
                >
                    + Create Note
                </Button>
            </div>

            {/* Filters Bar */}
            <Card title="Search & Filter Records" subtitle="Refine notes by priority scales, medical tags, or keywords">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        }
                    />

                    <div className="flex flex-col gap-1 w-full">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        >
                            <option value="all">All Categories</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="appointment">Appointment</option>
                            <option value="medical">Medical</option>
                            <option value="reminder">Reminder</option>
                            <option value="symptom">Symptom</option>
                            <option value="medication">Medication</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Grid display */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="animate-pulse rounded-2xl h-48 bg-slate-200" />
                    <div className="animate-pulse rounded-2xl h-48 bg-slate-200" />
                    <div className="animate-pulse rounded-2xl h-48 bg-slate-200" />
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm">
                    <span className="text-5xl block mb-3">📝</span>
                    <p className="font-semibold text-lg">No notes found matching current filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                    {filteredNotes.map((note) => (
                        <Card 
                          key={note._id}
                          className="hover:shadow-md transition-all duration-200 border-l-4 border-l-teal-500"
                          bodyClass="p-5 flex flex-col justify-between h-full space-y-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{getCategoryIcon(note.category)}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {note.category}
                                        </span>
                                    </div>
                                    <Badge variant={getPriorityBadgeVariant(note.priority)} size="xs">
                                        {note.priority}
                                    </Badge>
                                </div>

                                <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                                    {note.title}
                                </h3>

                                <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-3">
                                    {note.content}
                                </p>

                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {note.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-100"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-bold">
                                <span>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1.5">
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
                title={editingNote ? "Modify Note Details" : "Create New Medical Note"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Note Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Patient allergy warning"
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Detailed Message *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                            placeholder="Enter notes, diagnoses details or reminder description..."
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
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="appointment">Appointment</option>
                                <option value="medical">Medical</option>
                                <option value="reminder">Reminder</option>
                                <option value="symptom">Symptom</option>
                                <option value="medication">Medication</option>
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
                        placeholder="e.g., allergy, check-up, private"
                    />

                    <Input
                        label="Reference Identifier (Doctor/Patient ID)"
                        value={formData.relatedTo}
                        onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                        placeholder="Optional ID e.g., PAT001"
                    />

                    <label className="flex items-center gap-2 font-semibold text-slate-600 text-sm cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={formData.isPrivate}
                            onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                        />
                        Mark note as private
                    </label>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <Button type="submit" loading={formLoading} className="flex-1">
                            {editingNote ? "Save Changes" : "Save Note"}
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

export default AdminNotes;
