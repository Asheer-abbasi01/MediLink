// src/pages/admin/AdminDoctors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data.doctors || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
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
    const payload = {
      ...formData,
      qualifications: formData.qualifications
        ? formData.qualifications.split(",").map((q) => q.trim())
        : [],
    };

    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/doctors/${editingId}`, payload);
        setDoctors((prev) => prev.map((doc) => (doc._id === editingId ? res.data : doc)));
        alert("Doctor updated successfully");
      } else {
        const res = await axios.post("http://localhost:5000/api/doctors", payload);
        setDoctors((prev) => [...prev, res.data]);
        alert("Doctor added successfully");
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
      alert("Error saving doctor");
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
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://localhost:5000/api/doctors/${id}`);
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        alert("Doctor deleted successfully");
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Error deleting doctor");
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctors Management</h2>
        <p className="text-gray-600">Manage doctor records and information</p>
      </div>

      {/* Doctor Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {editingId ? (
            <>
              <span className="text-blue-600">✏️</span> Edit Doctor
            </>
          ) : (
            <>
              <span className="text-teal-600">➕</span> Add New Doctor
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Staff ID *</label>
              <input
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                placeholder="e.g., STF001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specialty *</label>
              <input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="e.g., Cardiologist"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="LIC123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
              <input
                name="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications (comma separated)</label>
              <input
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="MBBS, MD, FCPS"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? "Update Doctor" : "Add Doctor"}
            </button>
            {editingId && (
              <button
                type="button"
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
                className="px-8 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">All Doctors ({doctors.length})</h3>
        </div>

        {Array.isArray(doctors) && doctors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qualifications</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">ID: {doc.doctorId}</div>
                        <div className="text-sm text-gray-500">Staff: {doc.staffId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        {doc.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doc.contact || "N/A"}</div>
                      {doc.licenseNumber && (
                        <div className="text-xs text-gray-500">License: {doc.licenseNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doc.yearsExperience ? `${doc.yearsExperience} years` : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {doc.qualifications?.join(", ") || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
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
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 text-lg">No doctors found. Add your first doctor above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;
