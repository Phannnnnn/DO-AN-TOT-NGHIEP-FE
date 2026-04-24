import { Loading } from "@/components/common/Loading";
import { useAuth } from "@/context/ContextProvider";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const allowedRoles = ["ADMIN", "HOUSEKEEPING"];

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
