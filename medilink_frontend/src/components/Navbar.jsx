import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const handleGetStarted = () => {
    navigate("/choose-role");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDashboard = () => {
    if (userRole === 'admin') {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/home");
    }
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-teal-50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-200 group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-teal-700 text-xl font-bold leading-none tracking-tight">MediLink</span>
            <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">Healthcare</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          {["Home", "Doctors", "Medicines", "About"].map((item) => (
            <li key={item}>
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="hover:text-teal-600 transition-colors relative group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          {isLoggedIn && userRole === 'user' && (
            <li>
              <Link
                to="/user/appointments"
                className="hover:text-teal-600 transition-colors relative group py-2"
              >
                My Appointments
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleDashboard}
                className="text-teal-600 font-semibold hover:text-teal-800 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-semibold border border-red-100 hover:bg-red-100 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGetStarted}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-600 hover:text-teal-600 focus:outline-none transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
          {["Home", "Doctors", "Medicines", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-slate-600 font-medium hover:text-teal-600 hover:bg-teal-50 px-4 py-3 rounded-xl transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          {isLoggedIn && userRole === 'user' && (
            <Link
              to="/user/appointments"
              className="text-slate-600 font-medium hover:text-teal-600 hover:bg-teal-50 px-4 py-3 rounded-xl transition-all"
              onClick={() => setMenuOpen(false)}
            >
              My Appointments
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <button
                onClick={() => { setMenuOpen(false); handleDashboard(); }}
                className="bg-teal-50 text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-100 transition-all w-full text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); handleGetStarted(); }}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-all w-full"
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
