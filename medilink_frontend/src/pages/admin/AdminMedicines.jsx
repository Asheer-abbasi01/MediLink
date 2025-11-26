import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    medicineId: "",
    name: "",
    genericName: "",
    manufacturer: "",
    dosage: "",
    price: "",
    stock: "",
    status: "Available",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicines");
      setMedicines(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/medicines/${editingId}`, formData);
        setMedicines((prev) => prev.map((m) => (m._id === editingId ? res.data : m)));
        alert("Medicine updated successfully");
      } else {
        const res = await axios.post("http://localhost:5000/api/medicines", formData);
        setMedicines((prev) => [...prev, res.data]);
        alert("Medicine added successfully");
      }
      setFormData({ medicineId: "", name: "", genericName: "", manufacturer: "", dosage: "", price: "", stock: "", status: "Available" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving medicine:", err);
      alert("Error saving medicine");
    }
  };

  const handleEdit = (medicine) => {
    setFormData({
      medicineId: medicine.medicineId || "",
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      manufacturer: medicine.manufacturer || "",
      dosage: medicine.dosage || "",
      price: medicine.price || "",
      stock: medicine.stock || "",
      status: medicine.status || "Available",
    });
    setEditingId(medicine._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`http://localhost:5000/api/medicines/${id}`);
        setMedicines((prev) => prev.filter((m) => m._id !== id));
        alert("Medicine deleted successfully");
      } catch (err) {
        console.error("Error deleting medicine:", err);
        alert("Error deleting medicine");
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Medicines Management</h2>
        <p className="text-gray-600">Manage medicine inventory and pricing</p>
      </div>

      {/* Medicine Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {editingId ? (
            <>
              <span className="text-blue-600">✏️</span> Edit Medicine
            </>
          ) : (
            <>
              <span className="text-teal-600">➕</span> Add New Medicine
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine ID *</label>
              <input
                name="medicineId"
                value={formData.medicineId}
                onChange={handleChange}
                placeholder="e.g., MED001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Paracetamol"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Generic Name</label>
              <input
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                placeholder="e.g., Acetaminophen"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
              <input
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g., GSK"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage</label>
              <input
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 500mg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="10.50"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
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
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? "Update Medicine" : "Add Medicine"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ medicineId: "", name: "", genericName: "", manufacturer: "", dosage: "", price: "", stock: "", status: "Available" });
                }}
                className="px-8 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Medicines Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">All Medicines ({medicines.length})</h3>
        </div>

        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {medicines.map((medicine) => (
              <div key={medicine._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{medicine.name}</h4>
                    <p className="text-sm text-gray-600">{medicine.genericName || "No generic name"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${medicine.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {medicine.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium text-gray-900">{medicine.medicineId}</span>
                  </div>
                  {medicine.manufacturer && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Manufacturer:</span>
                      <span className="font-medium text-gray-900">{medicine.manufacturer}</span>
                    </div>
                  )}
                  {medicine.dosage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dosage:</span>
                      <span className="font-medium text-gray-900">{medicine.dosage}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-2xl font-bold text-teal-600">${medicine.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(medicine)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💊</div>
            <p className="text-gray-500 text-lg">No medicines found. Add your first medicine above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedicines;
