import { useAuth } from "@/context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/common/Loading";

export const RoleGuard = ({ allowedRoles, children }) => {
 const { user, loading } = useAuth();

 if (loading) {
 return <Loading />;
 }

 if (!user || !allowedRoles.includes(user.role)) {
 return <Navigate to="/" replace />;
 }

 return children;
};
