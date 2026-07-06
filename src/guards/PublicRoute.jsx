// src/guards/PublicRoute.jsx
import { useAuth } from "@/context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/common/Loading";

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const allowedRoles = ["ADMIN", "HOUSEKEEPING", "RECEPTIONIST"];

    if (loading) return <Loading />;

    // Đã đăng nhập và có vai trò hợp lệ → redirect về trang chủ
    if (user && allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};
