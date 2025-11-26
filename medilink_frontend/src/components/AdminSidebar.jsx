import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">MediLink Admin</h2>

      <nav className="space-y-3">
        <Link to="/admin/dashboard" className="block hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/admin/payments" className="block hover:bg-gray-700 p-2 rounded">
          Payments
        </Link>

        <Link to="/admin/users" className="block hover:bg-gray-700 p-2 rounded">
          Users
        </Link>

        <Link to="/admin/appointments" className="block hover:bg-gray-700 p-2 rounded">
          Appointments
        </Link>

        <Link to="/admin/doctors" className="block hover:bg-gray-700 p-2 rounded">
          Doctors
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
