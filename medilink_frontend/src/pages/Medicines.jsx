import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PurchasePopup from "../components/PurchasePopup";

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);

    useEffect(() => {
        fetchMedicines();
    }, []);

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

    // Filter medicines first
    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || med.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Group medicines by name
    const groupedMedicines = useMemo(() => {
        const groups = {};
        filteredMedicines.forEach(med => {
            const name = med.name?.trim();
            if (!name) return;

            // Normalize key to lowercase for grouping
            const key = name.toLowerCase();

            if (!groups[key]) {
                groups[key] = {
                    ...med,
                    _id: med._id, // Keep primary ID for key
                    ids: [med._id], // Track all IDs
                    medicines: [med], // Track all medicine objects
                    stock: med.stock || 0,
                    totalStock: med.stock || 0
                };
            } else {
                groups[key].medicines.push(med);
                groups[key].ids.push(med._id);
                groups[key].totalStock += (med.stock || 0);
                // We keep the details (price, etc) of the first one found
            }
        });
        return Object.values(groups);
    }, [filteredMedicines]);

    const handleBuyClick = (group) => {
        setSelectedMedicine(group); // Now passing the grouped object
        setShowPurchasePopup(true);
    };

    const handlePurchaseSuccess = (updatedMedicine) => {
        // Refresh medicines to get latest stock
        fetchMedicines();
    };

    const handleClosePopup = () => {
        setShowPurchasePopup(false);
        setSelectedMedicine(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Online Pharmacy</h1>
                    <p className="text-teal-100 text-base max-w-2xl mx-auto">
                        Order medicines online and get them delivered to your doorstep
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="max-w-7xl mx-auto px-6 -mt-6">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Medicines Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 mt-4 text-sm">Loading medicines...</p>
                    </div>
                ) : groupedMedicines.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-600 text-lg">No medicines found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {groupedMedicines.map((group) => {
                            const stock = group.totalStock;
                            const isAvailable = stock > 0;

                            return (
                                <div
                                    key={group._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative group"
                                >
                                    {/* Stock Badge */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-sm ${stock > 10
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : stock > 0
                                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                                : "bg-red-100 text-red-700 border border-red-200"
                                            }`}>
                                            Stock: {stock}
                                        </div>
                                    </div>

                                    <div className="h-24 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center group-hover:from-teal-100 group-hover:to-blue-100 transition-colors">
                                        <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">💊</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight truncate" title={group.name}>{group.name}</h3>
                                        <p className="text-xs text-slate-500 mb-3 truncate">
                                            <span className="font-medium">Generic:</span> {group.genericName || "N/A"}
                                        </p>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xl font-bold text-teal-600">${group.price}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isAvailable
                                                ? "bg-teal-50 text-teal-700 border border-teal-100"
                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                                }`}>
                                                {isAvailable ? "Available" : "Out of Stock"}
                                            </span>
                                        </div>

                                        <div className="space-y-1 mb-4">
                                            {group.dosage && (
                                                <p className="text-xs text-slate-500 flex justify-between">
                                                    <span className="font-medium">Dosage:</span>
                                                    <span>{group.dosage}</span>
                                                </p>
                                            )}
                                            {group.manufacturer && (
                                                <p className="text-xs text-slate-500 flex justify-between">
                                                    <span className="font-medium">Brand:</span>
                                                    <span className="truncate max-w-[100px]" title={group.manufacturer}>{group.manufacturer}</span>
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleBuyClick(group)}
                                            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${isAvailable
                                                ? "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md active:transform active:scale-95"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                            disabled={!isAvailable}
                                        >
                                            {isAvailable ? "Buy Now" : "Out of Stock"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MediLink. All rights reserved.</p>
            </footer>

            {/* Purchase Popup */}
            {showPurchasePopup && selectedMedicine && (
                <PurchasePopup
                    medicine={selectedMedicine}
                    onClose={handleClosePopup}
                    onSuccess={handlePurchaseSuccess}
                />
            )}
        </div>
    );
}
