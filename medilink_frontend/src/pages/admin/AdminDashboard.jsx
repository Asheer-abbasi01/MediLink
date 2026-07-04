import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Loader";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    bills: 0,
    medicines: 0,
    payments: 0,
    revenue: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const [doctorsRes, patientsRes, billsRes, medicinesRes, paymentsRes, appointmentsRes] = await Promise.all([
        client.get("/api/doctors"),
        client.get("/api/patients"),
        client.get("/api/bills"),
        client.get("/api/medicines"),
        client.get("/api/payments"),
        client.get("/api/appointments"),
      ]);

      const doctorsList = doctorsRes.data.doctors || doctorsRes.data || [];
      const patientsList = patientsRes.data || [];
      const billsList = billsRes.data || [];
      const medicinesList = medicinesRes.data || [];
      const paymentsList = paymentsRes.data || [];
      const appointmentsList = appointmentsRes.data.appointments || appointmentsRes.data || [];

      const totalRevenue = paymentsList.reduce((sum, p) => sum + Number(p.total || 0), 0);

      // Filter today's appointments
      const todayStr = new Date().toISOString().split("T")[0];
      const todayAppts = appointmentsList.filter(appt => {
        if (!appt.scheduledAt) return false;
        return appt.scheduledAt.startsWith(todayStr);
      });

      // Filter upcoming appointments (next 5)
      const upcoming = appointmentsList
        .filter(appt => appt.status === 'pending' || appt.status === 'confirmed')
        .slice(0, 5);

      setStats({
        doctors: doctorsList.length,
        patients: patientsList.length,
        bills: billsList.length,
        medicines: medicinesList.length,
        payments: paymentsList.length,
        revenue: totalRevenue,
        todayAppointments: todayAppts.length,
      });

      // Recent activities (last 5 bills)
      const recent = billsList.slice(-5).reverse().map(bill => ({
        type: 'Bill',
        id: bill.billId,
        patient: bill.patientId,
        amount: bill.totalAmount,
        status: bill.status,
      }));
      
      setRecentActivities(recent);
      setUpcomingAppointments(upcoming);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const quickActions = [
    { name: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️", color: "from-teal-500 to-teal-600" },
    { name: "Patients", path: "/admin/patients", icon: "🏥", color: "from-blue-500 to-blue-600" },
    { name: "Bills", path: "/admin/bills", icon: "📄", color: "from-purple-500 to-purple-600" },
    { name: "Medicines", path: "/admin/medicines", icon: "💊", color: "from-pink-500 to-pink-600" },
    { name: "Payments", path: "/admin/payments", icon: "💳", color: "from-amber-500 to-amber-600" },
    { name: "Analytics", path: "/admin/analytics", icon: "📊", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Hospital metrics, active cases, and recent transactions</p>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Doctors</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{stats.doctors}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">Active staff</p>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl font-bold">
            👨‍⚕️
          </div>
        </Card>

        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Patients</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{stats.patients}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">Registered clients</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
            🏥
          </div>
        </Card>

        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Today's Bookings</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{stats.todayAppointments}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">Active appointments</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-bold">
            📅
          </div>
        </Card>

        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-slate-800">${stats.revenue.toLocaleString()}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">All-time earnings</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">
            💰
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Services Access" subtitle="Navigate instantly to administrative settings panels">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-teal-500 hover:shadow-lg hover:shadow-teal-600/5 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 rounded-xl flex items-center justify-center text-2xl transition-all duration-200">
                {action.icon}
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-teal-700 text-xs transition-colors duration-200">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming appointments list */}
        <div className="lg:col-span-2">
          <Card title="Upcoming Bookings" subtitle="List of pending schedule logs to allocate">
            {upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {upcomingAppointments.map((appt) => (
                  <div key={appt._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
                        📅
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {appt.doctor?.name || "Doctor"}
                        </p>
                        <p className="text-slate-400 text-xs font-semibold">
                          Scheduled: {appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appt.status === 'confirmed' ? 'success' : 'warning'}>
                      {appt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <span className="text-3xl block mb-2">📂</span>
                <p className="text-sm font-semibold">No upcoming appointments found</p>
              </div>
            )}
          </Card>
        </div>

        {/* Recent bills activities */}
        <div>
          <Card title="Recent Activity" subtitle="Real-time log of invoice updates">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">Invoice #{activity.id}</p>
                        <p className="text-slate-400 text-[10px] font-semibold">Client: {activity.patient}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-extrabold text-teal-600 text-xs">${activity.amount}</p>
                      <Badge variant={activity.status === 'Paid' ? 'success' : 'warning'} size="xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <span className="text-3xl block mb-2">📊</span>
                <p className="text-sm font-semibold">No recent activity logs</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
