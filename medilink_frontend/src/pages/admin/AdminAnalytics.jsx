import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalMedicines: 0,
        totalBills: 0,
        totalPayments: 0,
        totalRevenue: 0,
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [paymentMethodData, setPaymentMethodData] = useState([]);
    const [billStatusData, setBillStatusData] = useState([]);
    const [specialtyData, setSpecialtyData] = useState([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            // Fetch all data
            const [doctors, patients, medicines, bills, payments] = await Promise.all([
                axios.get("http://localhost:5000/api/doctors"),
                axios.get("http://localhost:5000/api/patients"),
                axios.get("http://localhost:5000/api/medicines"),
                axios.get("http://localhost:5000/api/bills"),
                axios.get("http://localhost:5000/api/payments"),
            ]);

            const doctorsList = doctors.data.doctors || doctors.data || [];
            const patientsList = patients.data || [];
            const medicinesList = medicines.data || [];
            const billsList = bills.data || [];
            const paymentsList = payments.data || [];

            // Calculate stats
            const totalRevenue = paymentsList.reduce((sum, p) => sum + Number(p.total || 0), 0);

            setStats({
                totalDoctors: doctorsList.length,
                totalPatients: patientsList.length,
                totalMedicines: medicinesList.length,
                totalBills: billsList.length,
                totalPayments: paymentsList.length,
                totalRevenue: totalRevenue,
            });

            // Generate monthly revenue data
            const months = Array.from({ length: 12 }, (_, i) =>
                new Date(0, i).toLocaleString("default", { month: "short" })
            );

            const monthly = months.map((month, index) => {
                const monthPayments = paymentsList.filter(
                    (p) => p.paymentDate && new Date(p.paymentDate).getMonth() === index
                );
                const revenue = monthPayments.reduce((sum, p) => sum + Number(p.total || 0), 0);
                const count = monthPayments.length;
                return { month, revenue, payments: count };
            });
            setMonthlyData(monthly);

            // Payment method distribution
            const methodCounts = {};
            paymentsList.forEach((p) => {
                const method = p.paymentMethod || "Unknown";
                methodCounts[method] = (methodCounts[method] || 0) + 1;
            });
            const methodData = Object.entries(methodCounts).map(([name, value]) => ({ name, value }));
            setPaymentMethodData(methodData);

            // Bill status distribution
            const statusCounts = {};
            billsList.forEach((b) => {
                const status = b.status || "Unknown";
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
            setBillStatusData(statusData);

            // Doctor specialty distribution
            const specialtyCounts = {};
            doctorsList.forEach((d) => {
                const specialty = d.specialty || "Unknown";
                specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
            });
            const specialtyDataArray = Object.entries(specialtyCounts).map(([name, value]) => ({ name, value }));
            setSpecialtyData(specialtyDataArray);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setLoading(false);
        }
    };

    const COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive insights and statistics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-sm font-medium">Total Doctors</p>
                            <h3 className="text-4xl font-bold mt-2">{stats.totalDoctors}</h3>
                        </div>
                        <div className="text-5xl opacity-20">👨‍⚕️</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Patients</p>
                            <h3 className="text-4xl font-bold mt-2">{stats.totalPatients}</h3>
                        </div>
                        <div className="text-5xl opacity-20">🏥</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Medicines</p>
                            <h3 className="text-4xl font-bold mt-2">{stats.totalMedicines}</h3>
                        </div>
                        <div className="text-5xl opacity-20">💊</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-pink-100 text-sm font-medium">Total Bills</p>
                            <h3 className="text-4xl font-bold mt-2">{stats.totalBills}</h3>
                        </div>
                        <div className="text-5xl opacity-20">📄</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Payments</p>
                            <h3 className="text-4xl font-bold mt-2">{stats.totalPayments}</h3>
                        </div>
                        <div className="text-5xl opacity-20">💳</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-4xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                        <div className="text-5xl opacity-20">💰</div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Revenue Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} name="Revenue ($)" />
                            <Line type="monotone" dataKey="payments" stroke="#3b82f6" strokeWidth={3} name="Payments" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Method Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Methods Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {paymentMethodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bill Status Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Bill Status Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={billStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" name="Count" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Doctor Specialty Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Doctor Specialties</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={specialtyData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#0d9488" name="Doctors" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
