import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookAppointmentModal({ doctor, isOpen, onClose, onSuccess }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Fetch available slots when date is selected
    useEffect(() => {
        if (selectedDate && doctor) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctor]);

    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(
                `http://localhost:5000/api/appointments/available-slots/${doctor._id}/${selectedDate}`
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

            // Get user from localStorage
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setError("Please login to book an appointment");
                return;
            }

            const user = JSON.parse(userStr);

            if (!selectedDate || !selectedTime) {
                setError("Please select date and time");
                return;
            }

            setLoading(true);

            const appointmentData = {
                patient: user.id,
                doctor: doctor._id,
                scheduledAt: selectedTime,
                notes: notes
            };

            const res = await axios.post(
                "http://localhost:5000/api/appointments",
                appointmentData
            );

            setSuccess("Appointment booked successfully!");
            setLoading(false);

            // Reset form
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Book Appointment</h2>
                            <p className="text-teal-100">Dr. {doctor?.name}</p>
                            <p className="text-teal-100 text-sm">{doctor?.specialty}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                            {success}
                        </div>
                    )}

                    {/* Date Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime(""); // Reset time when date changes
                            }}
                            min={getMinDate()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Time Slot
                            </label>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-slate-600 mt-2">Loading available slots...</p>
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                    <p className="text-slate-600">No available slots for this date</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                                    {availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${selectedTime === slot.time
                                                    ? "bg-teal-600 text-white shadow-lg"
                                                    : slot.available
                                                        ? "bg-white border-2 border-gray-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            {slot.displayTime}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any specific concerns or symptoms..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-100 text-slate-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedTime || loading}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${!selectedDate || !selectedTime || loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                                }`}
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
