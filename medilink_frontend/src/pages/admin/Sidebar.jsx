import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Doctors", path: "/admin/doctors" },
    { name: "Appointments", path: "/admin/appointments" },
    { name: "Patients", path: "/admin/patients" },
    { name: "Bills", path: "/admin/bills" },
    { name: "Medicines", path: "/admin/medicines" },
    { name: "Payments", path: "/admin/payments" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="h-screen bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header - Fixed */}
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight">MediLink <span className="text-slate-400 text-sm font-normal">Admin</span></h2>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                ${isActive
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-white' : 'bg-slate-500 group-hover:bg-teal-400'}`}></span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
