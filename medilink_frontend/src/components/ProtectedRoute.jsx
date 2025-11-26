import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role && savedRole !== role)
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;