import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ChooseRole from "../pages/ChooseRole";
import NotFound from "../pages/Notfound";

// Public Pages
import Doctors from "../pages/Doctors";
import Medicines from "../pages/Medicines";
import About from "../pages/About";

// Layouts
import AdminLayout from "../components/AdminLayout";
import UserLayout from "../components/UserLayout";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminPayments from "../pages/admin/AdminPayments";
import PaymentForm from "../components/PaymentForm";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAppointments from "../pages/admin/AdminAppointments";
import AdminDoctors from "../pages/admin/AdminDoctors";
import AdminPatients from "../pages/admin/AdminPatients";
import AdminMedicines from "../pages/admin/AdminMedicines";
import AdminBills from "../pages/admin/AdminBills";

// User Pages
import UserHome from "../pages/user/UserHome";
import Appointment from "../pages/user/Appointment";
import Medicine from "../pages/user/Medicine";
import MyAppointments from "../pages/user/MyAppointments";

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return userRole === 'admin'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/home" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/about" element={<About />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute role="admin">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="payments/new" element={<PaymentForm />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="medicines" element={<AdminMedicines />} />
              <Route path="bills" element={<AdminBills />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user/*" element={
        <ProtectedRoute role="user">
          <UserLayout>
            <Routes>
              <Route path="home" element={<UserHome />} />
              <Route path="appointment" element={<Appointment />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="medicine" element={<Medicine />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}