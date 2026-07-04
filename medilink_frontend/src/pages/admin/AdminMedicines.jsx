import React, { useEffect, useState, useCallback } from "react";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Loader";
import Toast from "../../components/ui/Toast";

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await client.get("/api/medicines");
        setMedicines(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        showToast("Error retrieving medicine logs", "error");
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    // Cast stock and price
    const payload = {
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price)
    };
    try {
      if (editingId) {
        const res = await client.put(`/api/medicines/${editingId}`, payload);
        setMedicines((prev) => prev.map((m) => (m._id === editingId ? res.data : m)));
        showToast("Medicine records updated successfully");
      } else {
        const res = await client.post("/api/medicines", payload);
        setMedicines((prev) => [...prev, res.data]);
        showToast("Medicine item registered in stock catalog");
      }
      setFormData({ medicineId: "", name: "", genericName: "", manufacturer: "", dosage: "", price: "", stock: "", status: "Available" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving medicine:", err);
      showToast("Error saving medicine", "error");
    } finally {
      setFormLoading(false);
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
      stock: medicine.stock || medicine.quantity || "",
      status: medicine.status || "Available",
    });
    setEditingId(medicine._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await client.delete(`/api/medicines/${id}`);
        setMedicines((prev) => prev.filter((m) => m._id !== id));
        showToast("Medicine item deleted successfully");
      } catch (err) {
        console.error("Error deleting medicine:", err);
        showToast("Error deleting medicine", "error");
      }
    }
  };

  const filteredMedicines = medicines.filter(med => 
    med.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Stock Catalog</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage hospital pharmacies, drug counts, dosages, and unit retail prices</p>
      </div>

      {/* Form */}
      <Card 
        title={editingId ? "Edit Catalog Item" : "Add Medicine to Catalog"}
        subtitle="Specify dosing strength metrics and supplier manufacturers"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Medicine ID"
              name="medicineId"
              value={formData.medicineId}
              onChange={handleChange}
              placeholder="e.g., MED001"
              required
            />
            <Input
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Panadol"
              required
            />
            <Input
              label="Generic Chemical Name"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              placeholder="e.g., Paracetamol"
            />
            <Input
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g., GSK, Pfizer"
            />
            <Input
              label="Dosage Strength"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg, 10ml"
            />
            <Input
              label="Retail Unit Price ($)"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="4.99"
              required
            />
            <Input
              label="Stock In-Hand"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
              required
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Availability Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                required
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={formLoading}>
              {editingId ? "Update Item" : "Register Item"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ medicineId: "", name: "", genericName: "", manufacturer: "", dosage: "", price: "", stock: "", status: "Available" });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Grid List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-800">Drug Inventory ({filteredMedicines.length})</h3>
          <div className="w-full sm:max-w-xs">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by name..."
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {filteredMedicines.map((med) => {
              const currentStock = med.stock !== undefined ? med.stock : med.quantity || 0;
              const isLowStock = currentStock < 10;
              
              return (
                <Card 
                  key={med._id}
                  hoverEffect
                  className={isLowStock ? "border-rose-100 bg-rose-50/10" : ""}
                  bodyClass="p-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{med.name}</h4>
                        <p className="text-slate-400 text-xs mt-1 font-semibold">{med.genericName || "—"}</p>
                      </div>
                      <Badge variant={med.status === "Available" && currentStock > 0 ? "success" : "danger"} size="xs">
                        {med.status === "Available" && currentStock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-y border-slate-50 py-3 font-semibold text-slate-500">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Catalog ID</span>
                        <span className="text-slate-700">{med.medicineId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Dosage</span>
                        <span className="text-slate-700">{med.dosage || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Manufacturer</span>
                        <span className="text-slate-700 truncate block max-w-[110px]">{med.manufacturer || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Stock Count</span>
                        <span className={isLowStock ? "text-rose-600 font-extrabold" : "text-slate-700"}>
                          {currentStock} units {isLowStock && "⚠️"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Unit Price</span>
                      <span className="text-xl font-extrabold text-teal-600">${med.price ? Number(med.price).toFixed(2) : "0.00"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        onClick={() => handleEdit(med)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDelete(med._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm">
            <span className="text-5xl block mb-3">💊</span>
            <p className="font-semibold text-lg">No matching medicines cataloged</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedicines;
