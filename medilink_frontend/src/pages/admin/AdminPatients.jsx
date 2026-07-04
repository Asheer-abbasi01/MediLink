import React, { useEffect, useState } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchPatients = async () => {
    try {
      const res = await client.get("/api/patients");
      setPatients(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      showToast("Failed to fetch patients list", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        const res = await client.put(`/api/patients/${editingId}`, formData);
        setPatients((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
        showToast("Patient records updated successfully");
      } else {
        const res = await client.post("/api/patients", formData);
        setPatients((prev) => [...prev, res.data]);
        showToast("Patient profile registered successfully");
      }
      setFormData({ patientId: "", name: "", age: "", gender: "", contact: "", address: "", medicalHistory: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving patient:", err);
      showToast("Error processing request", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      patientId: patient.patientId || "",
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      contact: patient.contact || "",
      address: patient.address || "",
      medicalHistory: patient.medicalHistory || "",
    });
    setEditingId(patient._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient profile?")) {
      try {
        await client.delete(`/api/patients/${id}`);
        setPatients((prev) => prev.filter((p) => p._id !== id));
        showToast("Patient profile deleted successfully");
      } catch (err) {
        console.error("Error deleting patient:", err);
        showToast("Error deleting patient profile", "error");
      }
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} cols={5} />;
  }

  const tableHeaders = ["Patient Info", "Age & Gender", "Contact Details", "Medical Address", "Actions"];

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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patients Directory</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Add, update, and manage hospital patient database logs</p>
      </div>

      {/* Patient Form */}
      <Card 
        title={editingId ? "Edit Patient Records" : "Register New Patient"}
        subtitle="Ensure fields marked with (*) are filled accurately"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="e.g., PAT001"
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
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="30"
              required
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+92 300 1234567"
            />
            <Input
              label="Permanent Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
            />
            <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Medical History Summary</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Allergies, chronic conditions, or ongoing treatments..."
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              loading={formLoading}
            >
              {editingId ? "Update Profile" : "Register Patient"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ patientId: "", name: "", age: "", gender: "", contact: "", address: "", medicalHistory: "" });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Patients Table */}
      <Card title="Patient List" subtitle="List of registered patient records (sortable by search queries)">
        <Table
          headers={tableHeaders}
          data={patients}
          searchableKey="name"
          searchPlaceholder="Filter patients by name..."
          emptyMessage="No patient records found in directory"
          renderRow={(patient) => (
            <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">
                <div>{patient.name}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {patient.patientId}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-slate-700 font-medium text-xs">{patient.age} years</div>
                <Badge variant={patient.gender === 'Male' ? 'info' : 'danger'} size="xs" className="mt-1">
                  {patient.gender}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">{patient.contact || "—"}</td>
              <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[180px]">{patient.address || "—"}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleDelete(patient._id)}
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

export default AdminPatients;
