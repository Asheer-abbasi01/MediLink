// src/components/AdminLayout.jsx
import React from "react";
import Sidebar from "../pages/admin/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - Fixed to viewport */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-xl">
        <Sidebar />
      </div>

      {/* Main content - With left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
