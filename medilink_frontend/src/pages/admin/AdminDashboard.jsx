import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    bills: 0,
    medicines: 0,
    payments: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const [doctorsRes, patientsRes, billsRes, medicinesRes, paymentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/doctors"),
        axios.get("http://localhost:5000/api/patients"),
        axios.get("http://localhost:5000/api/bills"),
        axios.get("http://localhost:5000/api/medicines"),
        axios.get("http://localhost:5000/api/payments"),
      ]);

      const doctorsList = doctorsRes.data.doctors || doctorsRes.data || [];
      const patientsList = patientsRes.data || [];
      const billsList = billsRes.data || [];
      const medicinesList = medicinesRes.data || [];
      const paymentsList = paymentsRes.data || [];

      const totalRevenue = paymentsList.reduce((sum, p) => sum + Number(p.total || 0), 0);

      setStats({
        doctors: doctorsList.length,
        patients: patientsList.length,
        bills: billsList.length,
        medicines: medicinesList.length,
        payments: paymentsList.length,
        revenue: totalRevenue,
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

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );

  const quickActions = [
    { name: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
    { name: "Patients", path: "/admin/patients", icon: "🏥" },
    { name: "Bills", path: "/admin/bills", icon: "📄" },
    { name: "Medicines", path: "/admin/medicines", icon: "💊" },
    { name: "Payments", path: "/admin/payments", icon: "💳" },
    { name: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Doctors Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Doctors</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.doctors}</h3>
              <p className="text-gray-400 text-xs">Active medical staff</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              👨‍⚕️
            </div>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Patients</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.patients}</h3>
              <p className="text-gray-400 text-xs">Registered patients</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🏥
            </div>
          </div>
        </div>

        {/* Medicines Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Medicines</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.medicines}</h3>
              <p className="text-gray-400 text-xs">In inventory</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              💊
            </div>
          </div>
        </div>

        {/* Bills Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Bills</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.bills}</h3>
              <p className="text-gray-400 text-xs">Generated bills</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              📄
            </div>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Payments</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.payments}</h3>
              <p className="text-gray-400 text-xs">Processed payments</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              💳
            </div>
          </div>
        </div>

        {/* Revenue Card - Special emerald green for success metric */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-3">Total Revenue</p>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">${stats.revenue.toFixed(2)}</h3>
              <p className="text-gray-400 text-xs">All time revenue</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3"
            >
              <span className="text-4xl">{action.icon}</span>
              <span className="font-semibold text-sm">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.type} #{activity.id}</p>
                      <p className="text-sm text-gray-600">Patient: {activity.patient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">${activity.amount}</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${activity.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
