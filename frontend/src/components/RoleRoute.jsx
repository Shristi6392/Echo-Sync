import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const roleRouteMap = {
  USER: "/dashboard/user",
  PARTNER: "/dashboard/partner",
  ADMIN: "/dashboard/admin",
};

const RoleRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <Navigate to={roleRouteMap[user.role]} replace />;
  }
  return children;
};

export default RoleRoute;
