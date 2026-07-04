import React, { useState } from "react";
import Sidebar from "../pages/admin/Sidebar";
import AIChatbot from "./AIChatbot";

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Desktop Fixed Sidebar */}
      <div className={`hidden md:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 animate-in slide-in-from-left duration-200">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white"
              >
                ✕
              </button>
            </div>
            <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
          </div>
        </div>
      )}

      {/* Layout wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        {/* Mobile Header Topbar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-slate-950">MediLink</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* Floating chatbot */}
      <AIChatbot />
    </div>
  );
};

export default AdminLayout;
