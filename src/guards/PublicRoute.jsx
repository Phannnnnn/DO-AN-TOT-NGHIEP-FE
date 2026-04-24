// src/guards/PublicRoute.jsx
import { useAuth } from "@/context/ContextProvider";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/common/Loading";

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // Đã đăng nhập → redirect về trang chủ
  if (user) return <Navigate to="/" replace />;

  return children;
};
