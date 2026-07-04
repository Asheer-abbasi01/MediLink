import React, { useState, useEffect } from "react";
import client from "../api/client";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Badge from "./ui/Badge";

export default function BookAppointmentModal({ doctor, isOpen, onClose, onSuccess }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (selectedDate && doctor) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctor]);

    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await client.get(
                `/api/appointments/available-slots/${doctor._id}/${selectedDate}`
            );
            setAvailableSlots(res.data.slots || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching slots:", err);
            setError("Failed to load available slots");
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        try {
            setError("");
            setSuccess("");

            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setError("Please login to book an appointment");
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user.id || user._id;

            if (!selectedDate || !selectedTime) {
                setError("Please select date and time");
                return;
            }

            setLoading(true);

            const appointmentData = {
                patient: userId,
                doctor: doctor._id,
                scheduledAt: selectedTime,
                notes: notes
            };

            await client.post("/api/appointments", appointmentData);

            setSuccess("Appointment booked successfully!");
            setLoading(false);

            setTimeout(() => {
                setSelectedDate("");
                setSelectedTime("");
                setNotes("");
                setSuccess("");
                if (onSuccess) onSuccess();
                onClose();
            }, 2000);

        } catch (err) {
            console.error("Error booking appointment:", err);
            setError(err.response?.data?.error || "Failed to book appointment");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 text-white flex justify-between items-start">
                    <div>
                        <Badge variant="success" size="xs" className="!bg-teal-500/20 !text-teal-100 !border-teal-400/20 mb-2">
                            📅 SLOT SCHEDULER
                        </Badge>
                        <h2 className="text-xl font-extrabold tracking-tight">Book Patient Appointment</h2>
                        <p className="text-teal-100 text-xs font-semibold mt-1">Consulting Specialist: <span className="underline">Dr. {doctor?.name}</span> ({doctor?.specialty})</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl w-8 h-8 flex items-center justify-center transition-all font-bold text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Status Banners */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                            ✓ {success}
                        </div>
                    )}

                    {/* Date Selector */}
                    <Input
                        label="Select Date *"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime("");
                        }}
                        min={getMinDate()}
                        required
                    />

                    {/* Time Slots grid */}
                    {selectedDate && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Select Available Slot *</label>
                            {loading ? (
                                <div className="text-center py-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-bold">
                                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                    Scanning slots...
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-400 font-bold">
                                    No consultations slots available for this date
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1.5 border border-slate-50 rounded-2xl bg-slate-50/50">
                                    {availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all tracking-wide
                                              ${selectedTime === slot.time
                                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10 scale-[1.02]"
                                                : slot.available
                                                  ? "bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50"
                                                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                                              }`}
                                        >
                                            {slot.displayTime}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Concern notes */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Symptoms or Concerns (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Write down any symptoms, allergy descriptions or special medical instructions..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 resize-none text-xs font-semibold"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedTime || loading}
                            loading={loading}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
