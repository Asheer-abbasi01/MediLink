import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [billId, setBillId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardType, setCardType] = useState("Visa");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [medicinesUsed, setMedicinesUsed] = useState([{ medId: "", quantity: 1 }]);

  const [processing, setProcessing] = useState(false);
  const [transactionSteps, setTransactionSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicinesUsed];
    updated[index][field] = value;
    setMedicinesUsed(updated);
  };

  const addMedicineField = () => {
    setMedicinesUsed([...medicinesUsed, { medId: "", quantity: 1 }]);
  };

  const removeMedicineField = (index) => {
    if (medicinesUsed.length > 1) {
      setMedicinesUsed(medicinesUsed.filter((_, i) => i !== index));
    }
  };

  const updateTransactionStep = (step, status) => {
    setTransactionSteps(prev => {
      const existing = prev.find(s => s.step === step);
      if (existing) {
        return prev.map(s => s.step === step ? { ...s, status } : s);
      }
      return [...prev, { step, status }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setTransactionSteps([]);
    setProcessing(true);

    if (paymentMethod === "Card" && lastFourDigits.length !== 4) {
      setError("Card last four digits must be exactly 4 numbers");
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Starting Transaction
      updateTransactionStep("Starting Transaction", "processing");
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTransactionStep("Starting Transaction", "success");

      // Step 2: Creating Payment Record
      updateTransactionStep("Creating Payment Record", "processing");
      await new Promise(resolve => setTimeout(resolve, 500));

      const res = await axios.post(
        "http://localhost:5000/api/transactions/payment",
        {
          billId: Number(billId),
          patientId: Number(patientId),
          amount: Number(amount),
          paymentMethod,
          cardDetails: paymentMethod === "Card" ? { cardType, lastFourDigits } : {},
          medicinesUsed: medicinesUsed.map((m) => ({
            medId: m.medId,
            quantity: Number(m.quantity),
          })),
        }
      );

      updateTransactionStep("Creating Payment Record", "success");

      // Step 3: Updating Bill Status
      updateTransactionStep("Updating Bill Status to 'Paid'", "processing");
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTransactionStep("Updating Bill Status to 'Paid'", "success");

      // Step 4: Updating Medicine Stock
      updateTransactionStep("Updating Medicine Stock", "processing");
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTransactionStep("Updating Medicine Stock", "success");

      // Step 5: Committing Transaction
      updateTransactionStep("Committing Transaction", "processing");
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTransactionStep("Committing Transaction", "success");

      setMessage(res.data.message || "Payment processed successfully!");

      // Clear form after success
      setTimeout(() => {
        setBillId("");
        setPatientId("");
        setAmount("");
        setCardType("Visa");
        setLastFourDigits("");
        setMedicinesUsed([{ medId: "", quantity: 1 }]);
        setTransactionSteps([]);
      }, 3000);

    } catch (err) {
      // Mark all processing steps as failed
      setTransactionSteps(prev =>
        prev.map(s => s.status === "processing" ? { ...s, status: "failed" } : s)
      );
      updateTransactionStep("Transaction Aborted", "failed");
      setError(err.response?.data?.message || "Error processing payment. Transaction rolled back.");
    } finally {
      setProcessing(false);
    }
  };

  const getStepIcon = (status) => {
    switch (status) {
      case "processing":
        return <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>;
      case "success":
        return <span className="text-2xl">✅</span>;
      case "failed":
        return <span className="text-2xl">❌</span>;
      default:
        return <span className="text-2xl">⏳</span>;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Process Payment Transaction</h2>
        <p className="text-gray-600">Complete payment with MongoDB transaction (ACID properties)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bill ID *</label>
              <input
                placeholder="e.g., BILL001"
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
                disabled={processing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Patient ID *</label>
              <input
                placeholder="e.g., PAT001"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
                disabled={processing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount *</label>
              <input
                placeholder="1000.00"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
                disabled={processing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                disabled={processing}
              >
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {paymentMethod === "Card" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    disabled={processing}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last 4 Digits</label>
                  <input
                    placeholder="1234"
                    maxLength={4}
                    value={lastFourDigits}
                    onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/, ""))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    disabled={processing}
                  />
                </div>
              </div>
            )}

            <div className="pt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Medicines Used</label>
              <div className="space-y-3">
                {medicinesUsed.map((med, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      placeholder="Medicine ID (e.g., MED001)"
                      value={med.medId}
                      onChange={(e) => handleMedicineChange(index, "medId", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                      disabled={processing}
                    />
                    <input
                      placeholder="Qty"
                      type="number"
                      min="1"
                      value={med.quantity}
                      onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                      className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                      disabled={processing}
                    />
                    {medicinesUsed.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineField(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        disabled={processing}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMedicineField}
                className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                disabled={processing}
              >
                + Add Another Medicine
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
              disabled={processing}
            >
              {processing ? "Processing Transaction..." : "Process Payment"}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl">
              <p className="text-green-800 font-semibold text-center">{message}</p>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-xl">
              <p className="text-red-800 font-semibold text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Transaction Steps Visualization */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Transaction Steps</h3>

          {transactionSteps.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔄</div>
              <p className="text-gray-500">Transaction steps will appear here when processing</p>
              <div className="mt-6 text-left bg-gray-50 p-6 rounded-xl">
                <p className="font-semibold text-gray-700 mb-3">MongoDB Transaction Flow:</p>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1️⃣ Start Session & Transaction</li>
                  <li>2️⃣ Create Payment Record</li>
                  <li>3️⃣ Update Bill Status to "Paid"</li>
                  <li>4️⃣ Update Medicine Stock (Decrement)</li>
                  <li>5️⃣ Commit Transaction</li>
                  <li className="text-red-600 font-medium">⚠️ If any step fails → Rollback all changes</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {transactionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${step.status === "success"
                    ? "bg-green-50 border border-green-200"
                    : step.status === "failed"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                    }`}
                >
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${step.status === "success"
                      ? "text-green-800"
                      : step.status === "failed"
                        ? "text-red-800"
                        : "text-blue-800"
                      }`}>
                      {step.step}
                    </p>
                    <p className={`text-sm ${step.status === "success"
                      ? "text-green-600"
                      : step.status === "failed"
                        ? "text-red-600"
                        : "text-blue-600"
                      }`}>
                      {step.status === "success"
                        ? "Completed successfully"
                        : step.status === "failed"
                          ? "Failed - Rolling back"
                          : "In progress..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
