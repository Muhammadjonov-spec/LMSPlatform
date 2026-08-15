import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role } = useAuthStore();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
