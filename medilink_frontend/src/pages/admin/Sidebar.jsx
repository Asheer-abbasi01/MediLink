import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    { name: "Doctors", path: "/admin/doctors", icon: "👨‍⚕️" },
    { name: "Appointments", path: "/admin/appointments", icon: "📅" },
    { name: "Patients", path: "/admin/patients", icon: "🏥" },
    { name: "Bills", path: "/admin/bills", icon: "📄" },
    { name: "Medicines", path: "/admin/medicines", icon: "💊" },
    { name: "Payments", path: "/admin/payments", icon: "💳" },
    { name: "Notes", path: "/admin/notes", icon: "📝" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <h2 className="text-xl font-extrabold text-white tracking-tight animate-in fade-in duration-300">
            MediLink <span className="text-teal-500 text-xs font-semibold uppercase tracking-wider ml-1">Admin</span>
          </h2>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white font-extrabold text-md mx-auto">
            M
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all hidden md:block"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group relative
                ${isActive
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3.5 text-sm tracking-wide animate-in fade-in duration-200">
                  {item.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-3 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-teal-400 text-sm border border-slate-700">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-semibold truncate">Admin User</span>
              <span className="text-slate-500 text-xs truncate">admin@medilink.com</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all hover:shadow-lg hover:shadow-rose-600/10 ${isCollapsed ? "w-12 h-12 !p-0 mx-auto" : "w-full"}`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
