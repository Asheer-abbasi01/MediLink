import React, { useEffect, useState, useCallback } from "react";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    paymentId: "",
    userId: "",
    billId: "",
    total: "",
    paymentMethod: "",
    status: "",
    paymentDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await client.get("/api/payments");
      setPayments(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      showToast("Error retrieving payment logs", "error");
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    // Cast total to number
    const payload = {
      ...formData,
      total: Number(formData.total)
    };
    try {
      if (editingId) {
        const res = await client.put(`/api/payments/${editingId}`, payload);
        setPayments((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
        showToast("Payment records updated successfully");
      } else {
        const res = await client.post("/api/payments", payload);
        setPayments((prev) => [...prev, res.data]);
        showToast("Payment log created successfully");
      }
      setFormData({
        paymentId: "",
        userId: "",
        billId: "",
        total: "",
        paymentMethod: "",
        status: "",
        paymentDate: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving payment:", err);
      showToast("Error saving payment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      paymentId: p.paymentId,
      userId: p.userId,
      billId: p.billId,
      total: p.total,
      paymentMethod: p.paymentMethod,
      status: p.status,
      paymentDate: p.paymentDate ? p.paymentDate.slice(0, 10) : "",
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      try {
        await client.delete(`/api/payments/${id}`);
        setPayments((prev) => prev.filter((p) => p._id !== id));
        showToast("Payment record deleted successfully");
      } catch (err) {
        console.error("Error deleting payment:", err);
        showToast("Error deleting payment record", "error");
      }
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const tableHeaders = ["Payment ID", "Associated IDs", "Amount Collected", "Method", "Status", "Date", "Actions"];

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
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments Log</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Review verified hospital transaction ledgers and process invoices</p>
        </div>
        <Button
          onClick={() => navigate("/admin/payments/new")}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 flex items-center gap-2"
        >
          <span>💳</span>
          <span>New ACID Checkout</span>
        </Button>
      </div>

      {/* Payment Form */}
      <Card 
        title={editingId ? "Edit Payment Record" : "Add Payment Log"}
        subtitle="Note: Use 'New ACID Checkout' button for full ACID transaction workflows"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Payment ID"
              name="paymentId"
              value={formData.paymentId}
              onChange={handleChange}
              placeholder="e.g., PAY001"
              required
            />
            <Input
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="e.g., USR001"
              required
            />
            <Input
              label="Bill ID"
              name="billId"
              value={formData.billId}
              onChange={handleChange}
              placeholder="e.g., BILL001"
              required
            />
            <Input
              label="Total Amount ($)"
              name="total"
              type="number"
              step="0.01"
              value={formData.total}
              onChange={handleChange}
              placeholder="250.00"
              required
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Payment Method *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                required
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
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
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <Input
              label="Payment Date"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={formLoading}>
              {editingId ? "Update Log" : "Add Payment Log"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ paymentId: "", userId: "", billId: "", total: "", paymentMethod: "", status: "", paymentDate: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Payments Table */}
      <Card title="Transactions Ledger" subtitle="Review processed invoices and receipt details">
        <Table
          headers={tableHeaders}
          data={payments}
          searchableKey="paymentId"
          searchPlaceholder="Search payments by ID..."
          emptyMessage="No payments logged in system"
          renderRow={(payment) => (
            <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900">{payment.paymentId}</td>
              <td className="px-6 py-4 text-xs">
                <div className="text-slate-500">Bill Ref: <span className="font-semibold text-slate-700">{payment.billId}</span></div>
                <div className="text-slate-500">Patient Ref: <span className="font-semibold text-slate-700">{payment.userId || "—"}</span></div>
              </td>
              <td className="px-6 py-4 font-extrabold text-teal-600 text-sm">
                ${Number(payment.total).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                <Badge variant={payment.paymentMethod === 'Card' ? 'info' : 'success'} size="xs">
                  {payment.paymentMethod}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'danger'} size="xs">
                  {payment.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">
                {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "—"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => handleEdit(payment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleDelete(payment._id)}
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
  );
};

export default AdminPayments;
