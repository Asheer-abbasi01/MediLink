import React, { useEffect, useState } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: "",
    staffId: "",
    name: "",
    specialty: "",
    contact: "",
    licenseNumber: "",
    yearsExperience: "",
    qualifications: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchDoctors = async () => {
    try {
      const res = await client.get("/api/doctors");
      setDoctors(res.data.doctors || res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      showToast("Failed to fetch doctors list", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const payload = {
      ...formData,
      qualifications: formData.qualifications
        ? formData.qualifications.split(",").map((q) => q.trim())
        : [],
    };

    try {
      if (editingId) {
        const res = await client.put(`/api/doctors/${editingId}`, payload);
        setDoctors((prev) => prev.map((doc) => (doc._id === editingId ? res.data : doc)));
        showToast("Doctor profile updated successfully");
      } else {
        const res = await client.post("/api/doctors", payload);
        setDoctors((prev) => [...prev, res.data]);
        showToast("Doctor profile added successfully");
      }

      setFormData({
        doctorId: "",
        staffId: "",
        name: "",
        specialty: "",
        contact: "",
        licenseNumber: "",
        yearsExperience: "",
        qualifications: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving doctor:", err);
      showToast("Error saving doctor details", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setFormData({
      doctorId: doc.doctorId || "",
      staffId: doc.staffId || "",
      name: doc.name || "",
      specialty: doc.specialty || "",
      contact: doc.contact || "",
      licenseNumber: doc.licenseNumber || "",
      yearsExperience: doc.yearsExperience || "",
      qualifications: doc.qualifications ? doc.qualifications.join(", ") : "",
    });
    setEditingId(doc._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor profile?")) {
      try {
        await client.delete(`/api/doctors/${id}`);
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        showToast("Doctor profile deleted successfully");
      } catch (err) {
        console.error("Error deleting doctor:", err);
        showToast("Error deleting doctor profile", "error");
      }
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  const tableHeaders = ["Doctor Info", "Specialty", "Licensing", "Experience", "Qualifications", "Actions"];

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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctors Registry</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage doctor specialization records, contact info, and medical licenses</p>
      </div>

      {/* Doctor Form */}
      <Card 
        title={editingId ? "Edit Doctor Information" : "Register New Specialist"}
        subtitle="Provide all relevant qualifications and licensing metadata"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Doctor ID"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              placeholder="e.g., DOC001"
              required
            />
            <Input
              label="Staff ID"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              placeholder="e.g., STF001"
              required
            />
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. Jane Doe"
              required
            />
            <Input
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="e.g., Pediatrician, Oncologist"
              required
            />
            <Input
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+92 300 1234567"
            />
            <Input
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="e.g., LIC123456"
            />
            <Input
              label="Years of Experience"
              name="yearsExperience"
              type="number"
              value={formData.yearsExperience}
              onChange={handleChange}
              placeholder="12"
            />
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Qualifications (comma separated)</label>
              <Input
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g., MBBS, MD, FCPS"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              loading={formLoading}
            >
              {editingId ? "Update Specialist" : "Add Specialist"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    doctorId: "",
                    staffId: "",
                    name: "",
                    specialty: "",
                    contact: "",
                    licenseNumber: "",
                    yearsExperience: "",
                    qualifications: "",
                  });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Doctors Table */}
      <Card title="Doctors Directory" subtitle="Manage specialization metrics and verify active clinic licenses">
        <Table
          headers={tableHeaders}
          data={doctors}
          searchableKey="name"
          searchPlaceholder="Search doctors by name..."
          emptyMessage="No doctors registered in the database"
          renderRow={(doc) => (
            <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">
                <div>{doc.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {doc.doctorId} • Staff: {doc.staffId}</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="success" size="xs">
                  {doc.specialty}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs">
                <div className="text-slate-700 font-semibold">{doc.contact || "—"}</div>
                {doc.licenseNumber && (
                  <div className="text-slate-400 mt-0.5">License: {doc.licenseNumber}</div>
                )}
              </td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                {doc.yearsExperience ? `${doc.yearsExperience} years` : "—"}
              </td>
              <td className="px-6 py-4 text-xs text-slate-600">
                {doc.qualifications && doc.qualifications.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {doc.qualifications.map((q, idx) => (
                      <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">{q}</span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => handleEdit(doc)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleDelete(doc._id)}
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

export default AdminDoctors;
