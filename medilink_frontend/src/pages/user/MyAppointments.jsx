import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, upcoming, past
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setError("Please login to view appointments");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            const res = await axios.get(
                `http://localhost:5000/api/appointments/user/${user.id}`
            );

            setAppointments(res.data.appointments || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load appointments");
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
            // Refresh appointments
            fetchAppointments();
            alert("Appointment cancelled successfully");
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            alert("Failed to cancel appointment");
        }
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.scheduledAt);
        const now = new Date();

        if (filter === "upcoming") {
            return aptDate >= now && apt.status !== "cancelled" && apt.status !== "completed";
        } else if (filter === "past") {
            return aptDate < now || apt.status === "completed" || apt.status === "cancelled";
        }
        return true; // all
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "confirmed":
                return "bg-green-100 text-green-800 border-green-200";
            case "completed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            case "no-show":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Appointments</h1>
                    <p className="text-slate-600">View and manage your upcoming and past appointments</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "all"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("upcoming")}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "upcoming"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:bg-gray-100"
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter("past")}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "past"
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:bg-gray-100"
                            }`}
                    >
                        Past
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 mt-4">Loading appointments...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Appointments Found</h3>
                        <p className="text-slate-600">
                            {filter === "upcoming"
                                ? "You don't have any upcoming appointments"
                                : filter === "past"
                                    ? "You don't have any past appointments"
                                    : "You haven't booked any appointments yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Appointment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            {/* Doctor Avatar */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                                {appointment.doctor?.name?.charAt(0) || "D"}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                                    Dr. {appointment.doctor?.name}
                                                </h3>
                                                <p className="text-teal-600 font-semibold mb-2">
                                                    {appointment.doctor?.specialty}
                                                </p>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    <p className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(appointment.scheduledAt)}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatTime(appointment.scheduledAt)}
                                                    </p>
                                                    {appointment.notes && (
                                                        <p className="flex items-start gap-2 mt-2">
                                                            <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="italic">{appointment.notes}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>

                                        {/* Cancel Button - Only show for pending/confirmed appointments */}
                                        {(appointment.status === "pending" || appointment.status === "confirmed") &&
                                            new Date(appointment.scheduledAt) > new Date() && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment._id)}
                                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-200"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
