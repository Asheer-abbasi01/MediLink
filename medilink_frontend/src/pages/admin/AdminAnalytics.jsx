import React, { useEffect, useState } from "react";
import client from "../../api/client";
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
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Loader";

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
    const [lowStockMedicines, setLowStockMedicines] = useState([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            // Fetch all data
            const [doctors, patients, medicines, bills, payments] = await Promise.all([
                client.get("/api/doctors"),
                client.get("/api/patients"),
                client.get("/api/medicines"),
                client.get("/api/bills"),
                client.get("/api/payments"),
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

            // Low Stock Medicines (quantity < 10)
            const lowStock = medicinesList
                .filter((m) => {
                  const qty = m.stock !== undefined ? m.stock : m.quantity || 0;
                  return qty < 10;
                })
                .sort((a, b) => (a.stock || a.quantity || 0) - (b.stock || b.quantity || 0))
                .slice(0, 10);
            setLowStockMedicines(lowStock);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setLoading(false);
        }
    };

    const COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 animate-pulse" />
                <Skeleton className="h-4 w-72 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Insights</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Real-time statistics of patient logs, drug stocks, and financial collections</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card bodyClass="p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl" hoverEffect>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100 text-xs font-bold uppercase tracking-wider">Total Doctors</p>
                            <h3 className="text-4xl font-extrabold mt-2 tracking-tight">{stats.totalDoctors}</h3>
                        </div>
                        <span className="text-5xl opacity-20">👨‍⚕️</span>
                    </div>
                </Card>

                <Card bodyClass="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl" hoverEffect>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Patients</p>
                            <h3 className="text-4xl font-extrabold mt-2 tracking-tight">{stats.totalPatients}</h3>
                        </div>
                        <span className="text-5xl opacity-20">🏥</span>
                    </div>
                </Card>

                <Card bodyClass="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl" hoverEffect>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Collected Revenue</p>
                            <h3 className="text-4xl font-extrabold mt-2 tracking-tight">${stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                        <span className="text-5xl opacity-20">💰</span>
                    </div>
                </Card>
            </div>

            {/* Charts Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly revenue */}
                <Card title="Monthly Revenue Performance" subtitle="Collection and counts tracking across standard calendar months">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} name="Earnings ($)" />
                            <Line type="monotone" dataKey="payments" stroke="#3b82f6" strokeWidth={3} name="Payments Count" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Method distribution */}
                <Card title="Payment Mode Distribution" subtitle="Proportion of cash, credit, or digital checkout modes">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={paymentMethodData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
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
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Invoices status */}
                <Card title="Invoice Clearances" subtitle="Unpaid vs paid invoice distributions">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={billStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" name="Invoices Count" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Doctor specialty distribution */}
                <Card title="Specialist Allocations" subtitle="Breakdown of registered doctor fields">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={specialtyData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#64748b" />
                            <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                            <Legend />
                            <Bar dataKey="value" fill="#0d9488" name="Doctors Assigned" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Low stock medicines alarm */}
            <Card title="Inventory Re-Order List" subtitle="List of critical medicines matching critical threshold (<10 units)">
                {lowStockMedicines.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="bg-slate-50/50 text-slate-700 uppercase text-xs border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-6 font-bold">Medicine Name</th>
                                    <th className="py-3.5 px-6 font-bold text-center">Remaining Stock</th>
                                    <th className="py-3.5 px-6 font-bold text-center">Status Alert</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {lowStockMedicines.map((med, idx) => {
                                    const count = med.stock !== undefined ? med.stock : med.quantity || 0;
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="py-3.5 px-6 font-semibold text-slate-900">{med.name}</td>
                                            <td className="py-3.5 px-6 text-center">
                                                <Badge variant="danger" size="xs">
                                                    {count} units
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                <span className="text-xs font-bold text-rose-600">CRITICAL LIMIT ⚠️</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-400 font-semibold">
                        🎉 All medicines are adequately stocked!
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminAnalytics;
