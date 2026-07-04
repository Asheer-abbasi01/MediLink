import React, { useState } from "react";
import client from "../api/client";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const PurchasePopup = ({ medicine, onClose, onSuccess }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const maxQuantity = medicine.totalStock !== undefined ? medicine.totalStock : (medicine.stock || 0);
    const totalPrice = (medicine.price * quantity).toFixed(2);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= maxQuantity) {
            setQuantity(value);
            setError("");
        }
    };

    const handlePurchase = async () => {
        try {
            setLoading(true);
            setError("");

            const medicinesToProcess = medicine.medicines || [medicine];
            let remainingQuantity = quantity;
            let lastSuccessfulMedicine = null;

            for (const batch of medicinesToProcess) {
                if (remainingQuantity <= 0) break;

                const currentStock = batch.stock || 0;
                if (currentStock <= 0) continue;

                const amountToTake = Math.min(remainingQuantity, currentStock);

                if (amountToTake > 0) {
                    console.log(`Purchasing ${amountToTake} from batch ${batch._id}`);

                    const response = await client.post(
                        `/api/medicines/${batch._id}/purchase`,
                        { quantity: amountToTake }
                    );

                    if (response.data.success) {
                        remainingQuantity -= amountToTake;
                        lastSuccessfulMedicine = response.data.medicine;
                    } else {
                        throw new Error(response.data.message || "Purchase failed");
                    }
                }
            }

            if (remainingQuantity === 0) {
                setSuccess(true);
                onSuccess(lastSuccessfulMedicine);

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                throw new Error("Could not fulfill the entire quantity from available stock.");
            }

        } catch (err) {
            console.error("Purchase error:", err);
            setError(
                err.response?.data?.message || err.message || "Failed to complete purchase. Please try again."
            );
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-sans text-slate-800">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 text-white flex items-center justify-between">
                    <div>
                        <Badge variant="success" size="xs" className="!bg-teal-500/20 !text-teal-100 !border-teal-400/20 mb-2">
                            🛍️ DRUG CHECKOUT
                        </Badge>
                        <h3 className="text-lg font-extrabold tracking-tight">Confirm Purchase</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl w-8 h-8 flex items-center justify-center transition-all font-bold text-sm"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Details Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-center">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm mx-auto">
                            💊
                        </div>
                        <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{medicine.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Generic: {medicine.genericName || "—"}</p>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-500 font-semibold border-t border-slate-200/60 pt-3.5 text-left">
                            {medicine.dosage && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Dosage:</span>
                                    <span className="text-slate-700">{medicine.dosage}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-400">Price per unit:</span>
                                <span className="text-slate-950 font-bold text-teal-600">${Number(medicine.price).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Available Stock:</span>
                                <span className="text-slate-700">{maxQuantity} units</span>
                            </div>
                        </div>
                    </div>

                    {/* Qty Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">Quantity to Buy</label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all disabled:opacity-50"
                                disabled={quantity <= 1 || loading}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={maxQuantity}
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-center font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all disabled:opacity-50"
                                disabled={quantity >= maxQuantity || loading}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Total Box */}
                    <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">Total Price:</span>
                        <span className="text-2xl font-extrabold text-teal-600">${totalPrice}</span>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                            ✓ Purchase successful!
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            className="flex-1"
                            disabled={loading || success}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handlePurchase}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                            disabled={loading || success}
                            loading={loading}
                        >
                            Confirm Purchase
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePopup;
