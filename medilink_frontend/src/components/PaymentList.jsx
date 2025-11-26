// // src/components/PaymentList.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PaymentList = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/payments")
//       .then((res) => {
//         setPayments(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to fetch payments");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading payments...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Payment List</h2>
//       <table border="1" cellPadding="5">
//         <thead>
//           <tr>
//             <th>Payment ID</th>
//             <th>Bill ID</th>
//             <th>Amount</th>
//             <th>Payment Date</th>
//             <th>Method</th>
//             <th>Card Type</th>
//             <th>Last 4 Digits</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.map((payment) => (
//             <tr key={payment._id}>
//               <td>{payment.paymentId}</td>
//               <td>{payment.billId}</td>
//               <td>{payment.amount}</td>
//               <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
//               <td>{payment.paymentMethod}</td>
//               <td>{payment.cardDetails?.cardType || "-"}</td>
//               <td>{payment.cardDetails?.lastFourDigits || "-"}</td>
//               <td>{payment.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PaymentList;



/*
PaymentDashboard.jsx
React single-file admin dashboard (Tailwind + Recharts)

How to use:
1. Ensure your React app has Tailwind configured.
2. Install dependencies:
   npm install recharts file-saver papaparse
3. Copy this file into src/components/PaymentDashboard.jsx
4. Import and render <PaymentDashboard /> in your app.

Notes:
- The component attempts to fetch from /api/payments. If not available, use "Load CSV" to import the full dataset.
- Styling uses Tailwind utility classes. It also uses simple modal and table components.
*/


import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/payments")
      .then((res) => {
        setPayments(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load payments");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading payments...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  // Filter search
  const filtered = payments.filter((p) =>
    String(p.paymentId || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Delete item (local delete only)
  const deleteItem = (id) => {
    const confirmed = window.prompt("Type DELETE to remove:");
    if (confirmed === "DELETE") {
      setPayments((prev) => prev.filter((p) => p.paymentId !== id));
    }
  };

  const updateStatus = (id) => {
    const newStatus = window.prompt("Enter new status (Paid / Pending):");
    if (!newStatus) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.paymentId === id ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Payment List</h1>

      {/* Search */}
      <input
        type="text"
        className="border px-3 py-2 rounded mb-4 w-full"
        placeholder="Search Payment ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Payment ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.paymentId} className="text-center">
                <td className="border p-2">{p.paymentId}</td>
                <td className="border p-2">{p.userId}</td>
                <td className="border p-2">{p.paymentMethod}</td>
                <td className="border p-2">${p.total}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">
                  {new Date(p.paymentDate).toLocaleDateString()}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => updateStatus(p.paymentId)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteItem(p.paymentId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
