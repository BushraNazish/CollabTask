import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

type ProtectedRouteProps = {
  redirectTo?: string;
};

function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
