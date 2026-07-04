import React, { useEffect, useState, useCallback } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await client.get("/api/users");
      setUsers(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("Error retrieving user records", "error");
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        // If editing and password is blank, remove it so we don't overwrite with empty
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        
        const res = await client.put(`/api/users/${editingId}`, payload);
        setUsers((prev) => prev.map((u) => (u._id === editingId ? res.data : u)));
        showToast("User details updated successfully");
      } else {
        const res = await client.post("/api/users", formData);
        setUsers((prev) => [...prev, res.data]);
        showToast("User registered successfully");
      }
      setFormData({ userId: "", name: "", email: "", password: "", role: "user" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving user:", err);
      showToast("Error processing user details", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      userId: user.userId || "",
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
    setEditingId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user credentials log?")) {
      try {
        await client.delete(`/api/users/${id}`);
        setUsers((prev) => prev.filter((u) => u._id !== id));
        showToast("User records deleted successfully");
      } catch (err) {
        console.error("Error deleting user:", err);
        showToast("Error deleting user profile", "error");
      }
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} cols={4} />;
  }

  const tableHeaders = ["User Identity", "Email ID", "System Permission Role", "Actions"];

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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Control & Users</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage system logins, roles, and administrative authorization profiles</p>
      </div>

      {/* User Form */}
      <Card 
        title={editingId ? "Edit Credentials Profile" : "Register Credentials Profile"}
        subtitle="Manage authorization tokens and specify system security policies"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="e.g., USR001"
              required
            />
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
            <Input
              label={editingId ? "Reset Password (leave blank to keep current)" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required={!editingId}
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Access Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                required
              >
                <option value="user">User (Patient)</option>
                <option value="admin">Admin (Administrator)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={formLoading}>
              {editingId ? "Update Credentials" : "Add Credentials"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ userId: "", name: "", email: "", password: "", role: "user" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Users Table */}
      <Card title="User Directories" subtitle="Manage account registrations and specify security roles">
        <Table
          headers={tableHeaders}
          data={users}
          searchableKey="name"
          searchPlaceholder="Search users by name..."
          emptyMessage="No credentials profiles registered"
          renderRow={(user) => (
            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">
                <div>{user.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {user.userId}</div>
              </td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">{user.email}</td>
              <td className="px-6 py-4">
                <Badge variant={user.role === 'admin' ? 'danger' : 'info'} size="xs">
                  {user.role?.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleDelete(user._id)}
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

export default AdminUsers;
