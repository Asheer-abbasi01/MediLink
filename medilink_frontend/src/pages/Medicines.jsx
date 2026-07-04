import React, { useEffect, useState, useMemo } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";
import PurchasePopup from "../components/PurchasePopup";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Loader";

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await client.get("/api/medicines");
                setMedicines(res.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching medicines:", err);
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [refreshTrigger]);

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || med.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const groupedMedicines = useMemo(() => {
        const groups = {};
        filteredMedicines.forEach(med => {
            const name = med.name?.trim();
            if (!name) return;

            const key = name.toLowerCase();

            const stock = med.stock !== undefined ? med.stock : med.quantity || 0;

            if (!groups[key]) {
                groups[key] = {
                    ...med,
                    _id: med._id,
                    ids: [med._id],
                    medicines: [med],
                    stock: stock,
                    totalStock: stock
                };
            } else {
                groups[key].medicines.push(med);
                groups[key].ids.push(med._id);
                groups[key].totalStock += stock;
            }
        });
        return Object.values(groups);
    }, [filteredMedicines]);

    const handleBuyClick = (group) => {
        setSelectedMedicine(group);
        setShowPurchasePopup(true);
    };

    const handlePurchaseSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleClosePopup = () => {
        setShowPurchasePopup(false);
        setSelectedMedicine(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
            <div>
                <Navbar />

                {/* Hero */}
                <section className="bg-gradient-to-r from-teal-600 to-teal-800 py-16 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 opacity-10 pattern-dots"></div>
                    <div className="max-w-7xl mx-auto text-center text-white relative z-10 space-y-4">
                        <Badge variant="success" size="sm" className="!bg-teal-500/20 !text-teal-100 !border-teal-400/20">
                            💊 PHARMACY INVENTORY
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Online Medical Pharmacy</h1>
                        <p className="text-teal-100 text-sm md:text-base max-w-xl mx-auto font-medium">
                            Browse certified medical drugs, dosages, and verify stock availability instantly.
                        </p>
                    </div>
                </section>

                {/* Search & Filter */}
                <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                    <Card bodyClass="p-5 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or chemical generic..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full md:max-w-xs justify-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                            >
                                <option value="All">All Availability Status</option>
                                <option value="Available">Available</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </Card>
                </section>

                {/* Grid */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Skeleton className="h-64 rounded-2xl animate-pulse" />
                            <Skeleton className="h-64 rounded-2xl animate-pulse" />
                            <Skeleton className="h-64 rounded-2xl animate-pulse" />
                            <Skeleton className="h-64 rounded-2xl animate-pulse" />
                        </div>
                    ) : groupedMedicines.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 shadow-sm max-w-xl mx-auto">
                            <span className="text-5xl block mb-3">💊</span>
                            <p className="font-semibold text-lg">No matching medical items in catalog</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
                            {groupedMedicines.map((group) => {
                                const stock = group.totalStock;
                                const isAvailable = stock > 0;

                                return (
                                    <Card 
                                      key={group._id} 
                                      hoverEffect
                                      className="relative overflow-hidden"
                                      bodyClass="p-0 flex flex-col justify-between h-full"
                                    >
                                        {/* Stock Badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge variant={stock > 10 ? "success" : stock > 0 ? "warning" : "danger"} size="xs">
                                                Stock: {stock}
                                            </Badge>
                                        </div>

                                        <div className="h-28 bg-slate-50 flex items-center justify-center border-b border-slate-50">
                                            <span className="text-5xl">💊</span>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1" title={group.name}>{group.name}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Generic: {group.genericName || "—"}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 uppercase py-2 border-y border-slate-50">
                                                <div>
                                                    <span className="block text-slate-400">Dosage</span>
                                                    <span className="text-slate-700 font-semibold">{group.dosage || "—"}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-400">Brand</span>
                                                    <span className="text-slate-700 font-semibold truncate block max-w-[80px]">{group.manufacturer || "—"}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-[8px] text-slate-400 block font-bold uppercase">Price</span>
                                                    <span className="text-lg font-extrabold text-teal-600">${group.price ? Number(group.price).toFixed(2) : "0.00"}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    disabled={!isAvailable}
                                                    onClick={() => handleBuyClick(group)}
                                                    className="!px-3.5 !py-2 text-xs"
                                                >
                                                    {isAvailable ? "Buy Item" : "Sold Out"}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-10 text-center text-slate-400 text-xs font-semibold">
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
