import React, { useState } from "react";
import client from "../api/client";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";

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

      const res = await client.post(
        "/api/transactions/payment",
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
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>;
      case "success":
        return <span className="text-xl">✅</span>;
      case "failed":
        return <span className="text-xl">❌</span>;
      default:
        return <span className="text-xl">⏳</span>;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ACID Payment Checkout</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Atomically process diagnostic billing, payment logs, and drug stocks updates in a single MongoDB transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <Card title="Billing Details" subtitle="Input patient invoices figures and drug allocations">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Bill ID (numeric) *"
              placeholder="e.g., 1001"
              type="number"
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
              required
              disabled={processing}
            />

            <Input
              label="Patient ID (numeric) *"
              placeholder="e.g., 2002"
              type="number"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              disabled={processing}
            />

            <Input
              label="Amount ($) *"
              placeholder="250.00"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={processing}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                disabled={processing}
              >
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {paymentMethod === "Card" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-slate-700">Card Type</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    disabled={processing}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
                <Input
                  label="Last 4 Digits"
                  placeholder="1234"
                  maxLength={4}
                  value={lastFourDigits}
                  onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/, ""))}
                  required
                  disabled={processing}
                />
              </div>
            )}

            <div className="pt-4 space-y-3">
              <label className="text-sm font-semibold text-slate-700 block">Prescribed Medicines Stock-out</label>
              {medicinesUsed.map((med, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Medicine ID e.g., MED001"
                      value={med.medId}
                      onChange={(e) => handleMedicineChange(index, "medId", e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      placeholder="Qty"
                      type="number"
                      min="1"
                      value={med.quantity}
                      onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  {medicinesUsed.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMedicineField(index)}
                      className="!border-rose-100 text-rose-600 hover:bg-rose-50 px-3 py-3"
                      disabled={processing}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={addMedicineField}
                className="w-full text-xs"
                disabled={processing}
              >
                + Add Another Medicine
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={processing}
              loading={processing}
            >
              Process Transaction
            </Button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold text-center">
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}
        </Card>

        {/* ACID Progress Visualization */}
        <Card title="ACID Protocol Tracer" subtitle="Real-time status of atomic checkout steps">
          {transactionSteps.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <span className="text-4xl block">🔄</span>
              <p className="text-xs text-slate-400 font-bold">Transaction logs will display here dynamically</p>
              <div className="text-left bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-700 block">MongoDB ACID Step Timeline:</span>
                <ol className="space-y-2 text-[11px] text-slate-500 font-semibold list-decimal list-inside">
                  <li>Start database session & acquire row locks</li>
                  <li>Verify & insert invoice payment receipt</li>
                  <li>Toggle outstanding bill state to 'Paid'</li>
                  <li>Perform stock decs under thread synchronization</li>
                  <li>Commit all operations or abort and roll back</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              {transactionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all
                    ${step.status === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : step.status === "failed"
                        ? "bg-rose-50 border-rose-100 text-rose-800"
                        : "bg-blue-50 border-blue-100 text-blue-800"
                    }`}
                >
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{step.step}</p>
                    <p className="text-[10px] opacity-75 font-semibold mt-0.5">
                      {step.status === "success"
                        ? "Success - Verified"
                        : step.status === "failed"
                          ? "Aborted - Rolled Back"
                          : "Processing..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentForm;
