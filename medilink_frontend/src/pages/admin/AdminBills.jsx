import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, paid, pending
  const [formData, setFormData] = useState({
    billId: "",
    patientId: "",
    doctorId: "",
    totalAmount: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchBills = async () => {
    try {
      const res = await client.get("/api/bills");
      setBills(res.data || []);
      generateChart(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Error retrieving bills", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    // Cast totalAmount
    const payload = {
      ...formData,
      totalAmount: Number(formData.totalAmount)
    };
    try {
      let res;
      if (editingId) {
        res = await client.put(`/api/bills/${editingId}`, payload);
        setBills((prev) => prev.map((b) => (b._id === editingId ? res.data : b)));
        showToast("Bill updated successfully");
      } else {
        res = await client.post("/api/bills", payload);
        setBills((prev) => [...prev, res.data]);
        showToast("Bill created successfully");
      }
      setFormData({ billId: "", patientId: "", doctorId: "", totalAmount: "", status: "" });
      setEditingId(null);
      fetchBills();
    } catch (err) {
      console.error(err);
      showToast("Error saving bill", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (bill) => {
    setFormData({
      billId: bill.billId,
      patientId: bill.patientId,
      doctorId: bill.doctorId,
      totalAmount: bill.totalAmount,
      status: bill.status,
    });
    setEditingId(bill._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await client.delete(`/api/bills/${id}`);
      const updated = bills.filter((b) => b._id !== id);
      setBills(updated);
      generateChart(updated);
      showToast("Bill deleted successfully");
    } catch (err) {
      console.error(err);
      showToast("Error deleting bill", "error");
    }
  };

  const generateChart = (billsList) => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("default", { month: "short" })
    );

    const data = months.map((month, index) => {
      const filtered = billsList.filter((b) => {
        if (!b.createdAt) return false;
        return new Date(b.createdAt).getMonth() === index;
      });
      const count = filtered.length;
      const total = filtered.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
      return { month, bills: count, revenue: total };
    });

    setChartData(data);
  };

  const getFilteredBills = () => {
    if (activeTab === "paid") {
      return bills.filter(b => b.status === "Paid");
    } else if (activeTab === "pending") {
      return bills.filter(b => b.status === "Pending");
    }
    return bills;
  };

  const filteredBills = getFilteredBills();

  const stats = {
    total: bills.length,
    paid: bills.filter(b => b.status === "Paid").length,
    pending: bills.filter(b => b.status === "Pending").length,
    totalRevenue: bills.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
    paidRevenue: bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
    pendingRevenue: bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
  };

  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const tableHeaders = ["Bill ID", "Patient ID", "Doctor ID", "Amount Due", "Status", "Actions"];

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invoices & Billing</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Generate diagnostic/room invoices and monitor hospital revenue channels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue Generated</p>
            <h3 className="text-3xl font-extrabold text-slate-800">${stats.totalRevenue.toFixed(2)}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">{stats.total} Invoices Generated</p>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-lg font-bold">
            📄
          </div>
        </Card>

        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Collected Revenue</p>
            <h3 className="text-3xl font-extrabold text-slate-800">${stats.paidRevenue.toFixed(2)}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">{stats.paid} Paid Invoices</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg font-bold">
            ✅
          </div>
        </Card>

        <Card bodyClass="p-6 flex items-center justify-between" hoverEffect>
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Outstanding Revenue</p>
            <h3 className="text-3xl font-extrabold text-slate-800">${stats.pendingRevenue.toFixed(2)}</h3>
            <p className="text-slate-400 text-[10px] font-semibold">{stats.pending} Unpaid Invoices</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg font-bold">
            ⏳
          </div>
        </Card>
      </div>

      {/* Bill Form */}
      <Card 
        title={editingId ? "Edit Bill Details" : "Create Patient Invoice"}
        subtitle="Ensure the billing figures coordinate with prescribed stock usage records"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Bill ID"
              name="billId"
              value={formData.billId}
              onChange={handleChange}
              placeholder="e.g., BILL001"
              required
            />
            <Input
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="e.g., PAT001"
              required
            />
            <Input
              label="Doctor ID"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              placeholder="e.g., DOC001"
              required
            />
            <Input
              label="Total Amount ($)"
              name="totalAmount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="250.00"
              required
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                required
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={formLoading}>
              {editingId ? "Update Bill" : "Generate Invoice"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ billId: "", patientId: "", doctorId: "", totalAmount: "", status: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Analytics Chart */}
      <Card title="Revenue Growth Timeline" subtitle="Comparison of generated bills vs collections over the months">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
              cursor={{ fill: 'rgba(14, 116, 144, 0.05)' }}
            />
            <Legend />
            <Bar dataKey="bills" fill="#0d9488" name="Invoices Created" radius={[6, 6, 0, 0]} />
            <Bar dataKey="revenue" fill="#3b82f6" name="Earnings ($)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Bills Table with Tabs */}
      <div className="space-y-4">
        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-sm self-start gap-1">
          {["all", "paid", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider
                ${activeTab === tab
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
            >
              {tab} ({tab === 'all' ? stats.total : tab === 'paid' ? stats.paid : stats.pending})
            </button>
          ))}
        </div>

        <Card title="Billing Directory" subtitle="Review active invoices and outstanding invoice schedules">
          <Table
            headers={tableHeaders}
            data={filteredBills}
            searchableKey="billId"
            searchPlaceholder="Search bills by ID..."
            emptyMessage="No billing logs match this criteria"
            renderRow={(bill) => (
              <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{bill.billId}</td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-600">Patient: {bill.patientId}</td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-600">Doctor: {bill.doctorId}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-extrabold text-slate-800">${Number(bill.totalAmount).toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={bill.status === 'Paid' ? 'success' : bill.status === 'Pending' ? 'warning' : 'danger'} size="xs">
                    {bill.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      onClick={() => handleEdit(bill)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDelete(bill._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminBills;
