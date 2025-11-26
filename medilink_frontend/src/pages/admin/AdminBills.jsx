import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    billId: "",
    patientId: "",
    doctorId: "",
    totalAmount: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bills");
      setBills(res.data || []);
      generateChart(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await axios.put(`http://localhost:5000/api/bills/${editingId}`, formData);
        setBills((prev) => prev.map((b) => (b._id === editingId ? res.data : b)));
        alert("Bill updated successfully");
      } else {
        res = await axios.post("http://localhost:5000/api/bills", formData);
        setBills((prev) => [...prev, res.data]);
        alert("Bill added successfully");
      }
      setFormData({ billId: "", patientId: "", doctorId: "", totalAmount: "", status: "" });
      setEditingId(null);
      generateChart([...bills, res.data]);
    } catch (err) {
      console.error(err);
      alert("Error saving bill");
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bills/${id}`);
      const updated = bills.filter((b) => b._id !== id);
      setBills(updated);
      generateChart(updated);
      alert("Bill deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting bill");
    }
  };

  const generateChart = (billsList) => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("default", { month: "short" })
    );

    const data = months.map((month, index) => {
      const count = billsList.filter(
        (b) => new Date(b.createdAt).getMonth() === index
      ).length;
      const total = billsList
        .filter((b) => new Date(b.createdAt).getMonth() === index)
        .reduce((sum, b) => sum + Number(b.totalAmount), 0);
      return { month, bills: count, revenue: total };
    });

    setChartData(data);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bills Management</h2>
        <p className="text-gray-600">Track billing and revenue analytics</p>
      </div>

      {/* Bill Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {editingId ? (
            <>
              <span className="text-blue-600">✏️</span> Edit Bill
            </>
          ) : (
            <>
              <span className="text-teal-600">➕</span> Add New Bill
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bill ID *</label>
              <input
                name="billId"
                value={formData.billId}
                onChange={handleChange}
                placeholder="e.g., BILL001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Patient ID *</label>
              <input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                placeholder="e.g., PAT001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor ID *</label>
              <input
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="e.g., DOC001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount *</label>
              <input
                name="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="1000.00"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? "Update Bill" : "Add Bill"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ billId: "", patientId: "", doctorId: "", totalAmount: "", status: "" });
                }}
                className="px-8 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Bills & Revenue Analytics (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(14, 116, 144, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="bills" fill="#0d9488" name="Number of Bills" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">All Bills ({bills.length})</h3>
        </div>

        {bills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bill ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{bill.billId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bill.patientId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bill.doctorId}</td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-teal-600">${bill.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bill._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500 text-lg">No bills found. Add your first bill above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBills;
