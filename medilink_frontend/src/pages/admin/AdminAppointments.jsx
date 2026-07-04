import React, { useEffect, useState, useCallback } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    doctorId: "All",
    date: ""
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await client.get("/api/doctors");
        setDoctors(res.data.doctors || res.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.status !== "All") params.status = filters.status;
        if (filters.doctorId !== "All") params.doctorId = filters.doctorId;
        if (filters.date) params.date = filters.date;

        const res = await client.get("/api/appointments", { params });
        setAppointments(res.data.appointments || res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        showToast("Failed to load appointments logs", "error");
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filters, refreshTrigger, showToast]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await client.put(`/api/appointments/${id}/status`, { status: newStatus });
      setRefreshTrigger(prev => prev + 1);
      showToast(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment request?")) {
      try {
        await client.delete(`/api/appointments/${id}`);
        setRefreshTrigger(prev => prev + 1);
        showToast("Appointment cancelled successfully");
      } catch (err) {
        console.error("Error cancelling appointment:", err);
        showToast("Failed to cancel appointment", "error");
      }
    }
  };

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
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading && doctors.length === 0) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const tableHeaders = ["Patient Info", "Doctor / Specialist", "Scheduled Date & Time", "Status", "Special Notes", "Actions"];

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
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Ledger</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Review, authorize, and track all booking timelines</p>
        </div>
        <Button onClick={() => setRefreshTrigger(prev => prev + 1)} variant="secondary">
          Refresh List
        </Button>
      </div>

      {/* Filters */}
      <Card title="Quick Search Filters" subtitle="Narrow down bookings by specialist, status, or date range">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Filter by Doctor</label>
            <select
              value={filters.doctorId}
              onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">All Specialists</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialty})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Filter by Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card title="Appointment Logs" subtitle="List of pending/confirmed schedules">
        <Table
          headers={tableHeaders}
          data={appointments}
          loading={loading}
          emptyMessage="No appointments match current filters"
          renderRow={(apt) => (
            <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">
                <div>{apt.patient?.name || "Unknown"}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{apt.patient?.email || "—"}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800">Dr. {apt.doctor?.name || "Unknown"}</div>
                <div className="text-[10px] text-teal-600 font-bold uppercase mt-0.5">{apt.doctor?.specialty}</div>
              </td>
              <td className="px-6 py-4 text-xs">
                <div className="text-slate-800 font-semibold">{formatDate(apt.scheduledAt)}</div>
                <div className="text-slate-400 mt-0.5 font-semibold">Time Slot: {formatTime(apt.scheduledAt)}</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={getStatusVariant(apt.status)} size="xs">
                  {apt.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 max-w-[150px] truncate" title={apt.notes}>
                {apt.notes || "—"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-1.5">
                  {apt.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:bg-emerald-50 !p-1.5"
                      onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                      title="Confirm booking"
                    >
                      ✓
                    </Button>
                  )}
                  {apt.status === 'confirmed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50 !p-1.5"
                      onClick={() => handleStatusUpdate(apt._id, 'completed')}
                      title="Mark completed"
                    >
                      🏁
                    </Button>
                  )}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50 !p-1.5"
                      onClick={() => handleDelete(apt._id)}
                      title="Cancel booking"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default AdminAppointments;
