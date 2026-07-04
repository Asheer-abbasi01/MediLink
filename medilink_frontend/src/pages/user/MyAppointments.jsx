import React, { useEffect, useState } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, upcoming, past
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

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
            const userId = user.id || user._id;
            
            const res = await client.get(`/api/appointments/user/${userId}`);
            setAppointments(res.data.appointments || res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load appointments");
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment slot request?")) {
            return;
        }

        try {
            await client.delete(`/api/appointments/${appointmentId}`);
            fetchAppointments();
            showToast("Appointment cancelled successfully");
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            showToast("Failed to cancel appointment", "error");
        }
    };

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

    const getStatusVariant = (status) => {
        switch (status) {
            case "pending": return "warning";
            case "confirmed": return "success";
            case "completed": return "info";
            case "cancelled": return "danger";
            default: return "neutral";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    };

    if (loading && appointments.length === 0) {
        return <TableSkeleton rows={4} cols={5} />;
    }

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
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Scheduled Visits</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Review your upcoming consultations, prescriptions, and past diagnostics timeline</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-sm self-start gap-1 w-full max-w-sm">
                {["all", "upcoming", "past"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                          filter === t
                            ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                            : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold text-center">
                    ⚠️ {error}
                </div>
            )}

            {/* List */}
            {filteredAppointments.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm">
                    <span className="text-5xl block mb-3">📅</span>
                    <p className="font-semibold text-lg">No appointments match current filters</p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                    {filteredAppointments.map((appt) => (
                        <Card 
                          key={appt._id} 
                          bodyClass="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                          hoverEffect
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-teal-600 text-xl font-bold flex-shrink-0">
                                    {appt.doctor?.name ? appt.doctor.name.charAt(0).toUpperCase() : "D"}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                                        Dr. {appt.doctor?.name || "Specialist"}
                                    </h3>
                                    <p className="text-teal-600 text-xs font-bold uppercase tracking-wider">
                                        {appt.doctor?.specialty}
                                    </p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-xs font-semibold pt-1">
                                        <span className="flex items-center gap-1">
                                            📅 {formatDate(appt.scheduledAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            ⏰ {formatTime(appt.scheduledAt)}
                                        </span>
                                    </div>
                                    {appt.notes && (
                                        <p className="text-slate-500 text-xs italic mt-2 border-l-2 border-teal-500/30 pl-2">
                                            "{appt.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 justify-between md:justify-start border-t border-slate-50 pt-4 md:border-0 md:pt-0">
                                <Badge variant={getStatusVariant(appt.status)} size="xs">
                                    {appt.status}
                                </Badge>

                                {(appt.status === "pending" || appt.status === "confirmed") && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="!border-rose-100 text-rose-600 hover:bg-rose-50"
                                        onClick={() => handleCancelAppointment(appt._id)}
                                    >
                                        Cancel Appointment
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
