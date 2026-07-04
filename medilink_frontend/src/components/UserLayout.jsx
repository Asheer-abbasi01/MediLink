import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AIChatbot from "./AIChatbot";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/user/home", icon: "📊" },
    { name: "Book Appointment", path: "/doctors", icon: "📅" },
    { name: "My Appointments", path: "/user/appointments", icon: "📋" },
    { name: "Buy Medicines", path: "/medicines", icon: "💊" },
    { name: "My Notes", path: "/user/notes", icon: "📝" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const sidebarContent = (
    <div className="h-full bg-white flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-50 flex-shrink-0">
        <h1 className="text-xl font-extrabold text-teal-600 tracking-tight">MediLink</h1>
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Patient Portal</p>
      </div>

      {/* Nav list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200
                ${isActive
                  ? "bg-teal-50 text-teal-600 border-l-4 border-teal-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="ml-3.5 text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Context bottom */}
      <div className="p-4 border-t border-slate-50 flex flex-col gap-3.5 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-600 text-sm border border-teal-100">
            {user.name ? user.name.substring(0, 2).toUpperCase() : "PA"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-slate-800 text-sm font-semibold truncate">{user.name || "Patient"}</span>
            <span className="text-slate-400 text-xs truncate">{user.email || "patient@medilink.com"}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-sm font-bold transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 shadow-sm hidden md:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-in slide-in-from-left duration-200">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white focus:outline-none"
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main body wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Mobile Header topbar */}
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

        <main className="flex-1 p-6 md:p-10 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating chatbot */}
      <AIChatbot />
    </div>
  );
};

export default UserLayout;
