import React, { useState } from "react";
import axios from "axios";

const PurchasePopup = ({ medicine, onClose, onSuccess }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Use totalStock if available (grouped), otherwise fallback to stock
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

            // If it's a grouped medicine, we need to fulfill the order from multiple batches
            const medicinesToProcess = medicine.medicines || [medicine];
            let remainingQuantity = quantity;
            let lastSuccessfulMedicine = null;

            // Sort by stock (descending) to use largest batches first, or just iterate
            // Let's just iterate to keep it simple

            for (const batch of medicinesToProcess) {
                if (remainingQuantity <= 0) break;

                const currentStock = batch.stock || 0;
                if (currentStock <= 0) continue;

                // Determine how much to take from this batch
                const amountToTake = Math.min(remainingQuantity, currentStock);

                if (amountToTake > 0) {
                    console.log(`Purchasing ${amountToTake} from batch ${batch._id}`);

                    const response = await axios.post(
                        `http://localhost:5000/api/medicines/${batch._id}/purchase`,
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
                // Success!
                setSuccess(true);
                onSuccess(lastSuccessfulMedicine); // Pass back the last updated one, parent will refresh all

                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                // Partial success or failure
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white">Purchase Medicine</h3>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                            disabled={loading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Medicine Details */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-center mb-3">
                            <span className="text-6xl">💊</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 text-center">{medicine.name}</h4>
                        <p className="text-sm text-gray-600 text-center">
                            <span className="font-semibold">Generic:</span> {medicine.genericName || "N/A"}
                        </p>
                        {medicine.dosage && (
                            <p className="text-sm text-gray-600 text-center">
                                <span className="font-semibold">Dosage:</span> {medicine.dosage}
                            </p>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Price per unit:</span>
                            <span className="text-lg font-bold text-teal-600">${medicine.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total available stock:</span>
                            <span className="text-sm font-semibold text-gray-900">{maxQuantity} units</span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity >= maxQuantity || loading}
                            >
                                +
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                            Maximum: {maxQuantity} units
                        </p>
                    </div>

                    {/* Total Price */}
                    <div className="bg-teal-50 rounded-xl p-4 border-2 border-teal-200">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                            <span className="text-3xl font-bold text-teal-600">${totalPrice}</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-600 text-center font-semibold">
                                ✓ Purchase successful!
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || success}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePurchase}
                            className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Confirm Purchase"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePopup;
