import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Loader";

const UserHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || user._id;
  const userRefId = user.userId;
  
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const [appointmentsRes, billsRes] = await Promise.all([
        client.get(`/api/appointments/user/${userId}`),
        client.get("/api/bills")
      ]);

      const appts = appointmentsRes.data.appointments || appointmentsRes.data || [];
      const userBills = (billsRes.data || []).filter(b => b.patientId === userRefId);

      setAppointments(appts.slice(0, 3));
      setBills(userBills.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user dashboard data:", err);
      setLoading(false);
    }
  }, [userId, userRefId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 animate-pulse" />
        <Skeleton className="h-4 w-96 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    );
  }

  const upcomingAppt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
  const outstandingBill = bills.find(b => b.status === 'Pending');

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="relative z-10 space-y-3">
          <Badge variant="success" size="xs" className="!bg-teal-500/20 !text-teal-100 !border-teal-400/20">
            🏥 Patient Dashboard
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Welcome Back, {user.name || "User"}
          </h1>
          <p className="text-teal-100 text-sm md:text-base font-semibold max-w-xl">
            Keep track of your appointments, check medicine status, and manage medical billing details securely.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Appointment */}
        <Card title="Upcoming Appointment" subtitle="Your next verified slot request">
          {upcomingAppt ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Doctor</span>
                <span className="text-sm font-bold text-slate-800">Dr. {upcomingAppt.doctor?.name || "Specialist"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Specialty</span>
                <Badge variant="info" size="xs">{upcomingAppt.doctor?.specialty || "General"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Time</span>
                <span className="text-xs font-semibold text-slate-700">
                  {new Date(upcomingAppt.scheduledAt).toLocaleDateString()} @ {new Date(upcomingAppt.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="text-3xl block mb-2">📅</span>
              <p className="text-xs font-semibold text-slate-500">No scheduled visits</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate("/doctors")}>
                Book Now
              </Button>
            </div>
          )}
        </Card>

        {/* Outstanding Bills */}
        <Card title="Outstanding Bills" subtitle="Unpaid invoice summary">
          {outstandingBill ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Invoice ID</span>
                <span className="text-sm font-bold text-slate-800">{outstandingBill.billId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Amount Due</span>
                <span className="text-lg font-extrabold text-rose-600">${outstandingBill.totalAmount}</span>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate("/user/appointments")} // Direct user to checkout forms
              >
                Complete Payment
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-xs font-semibold text-slate-500 font-bold text-emerald-600">All invoices cleared!</p>
            </div>
          )}
        </Card>

        {/* Access Actions Grid */}
        <Card title="Portal Shortcuts" subtitle="Jump instantly to portal sections">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate("/doctors")}
              className="p-3 text-center bg-slate-50 border border-slate-100 hover:border-teal-500 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-teal-700 flex flex-col items-center justify-center gap-1"
            >
              <span>📅</span> Book Vis
            </button>
            <button
              onClick={() => navigate("/user/appointments")}
              className="p-3 text-center bg-slate-50 border border-slate-100 hover:border-teal-500 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-teal-700 flex flex-col items-center justify-center gap-1"
            >
              <span>📋</span> Vis Log
            </button>
            <button
              onClick={() => navigate("/medicines")}
              className="p-3 text-center bg-slate-50 border border-slate-100 hover:border-teal-500 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-teal-700 flex flex-col items-center justify-center gap-1"
            >
              <span>💊</span> Pharmacy
            </button>
            <button
              onClick={() => navigate("/user/notes")}
              className="p-3 text-center bg-slate-50 border border-slate-100 hover:border-teal-500 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-teal-700 flex flex-col items-center justify-center gap-1"
            >
              <span>📝</span> My Notes
            </button>
          </div>
        </Card>
      </div>

      {/* Detailed Tables lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments history logs */}
        <Card title="Appointment Log History" subtitle="Your recent schedule records">
          {appointments.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {appointments.map((appt) => (
                <div key={appt._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Dr. {appt.doctor?.name || "Specialist"}</p>
                    <p className="text-slate-400 text-xs font-semibold">
                      {new Date(appt.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={appt.status === 'confirmed' ? 'success' : appt.status === 'pending' ? 'warning' : 'danger'}>
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center font-bold">No appointment history logs found</p>
          )}
        </Card>

        {/* Bills list */}
        <Card title="Billing & Invoices History" subtitle="Your generated invoice accounts">
          {bills.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {bills.map((bill) => (
                <div key={bill._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Invoice #{bill.billId}</p>
                    <p className="text-slate-400 text-xs font-semibold">Amount: ${bill.totalAmount}</p>
                  </div>
                  <Badge variant={bill.status === 'Paid' ? 'success' : 'warning'}>
                    {bill.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center font-bold">No billing invoice logs found</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserHome;
