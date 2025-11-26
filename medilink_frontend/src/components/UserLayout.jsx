import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored tokens if necessary
        localStorage.removeItem("userRole"); // Example
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-teal-600">MediLink</h1>
                    <p className="text-sm text-gray-500">User Portal</p>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link
                        to="/user/home"
                        className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/user/appointment"
                        className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        Appointments
                    </Link>
                    <Link
                        to="/user/medicine"
                        className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        Medicines
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-8"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-teal-600">MediLink</h1>
                <button onClick={handleLogout} className="text-red-600 text-sm">Logout</button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;
