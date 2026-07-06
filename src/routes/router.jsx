import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import MainLayout from "../layouts/mainLayout/MainLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import RoomManagementPage from "../pages/RoomManagement/RoomManagementPage";
import InvoicesPage from "../pages/Invoices/InvoicesPage";
import App from "../App";
import LoginPage from "@/pages/Auth/LoginPage";
import { PrivateRoute } from "@/guards/PrivateRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import { RoleGuard } from "@/guards/RoleGuard";
import RoomTypeManagementPage from "@/pages/RoomType/RoomTypeManagementPage";
import RoomConfigPage from "@/pages/RoomConFig/RoomConfigPage";
import ReportPage from "@/pages/Report/ReportPage";
import HousekeepingPage from "@/pages/Housekeeping/HousekeepingPage";
import UserPage from "@/pages/User/UserPage";
import BookingManagementPage from "../pages/Booking/BookingManagementPage";
import ServiceManagementPage from "../pages/ServiceManagement/ServiceManagementPage";
import CustomerManagementPage from "@/pages/Customer/CustomerManagementPage";

export const router = createBrowserRouter([
 {
 path: "/",
 element: <App />,
 errorElement: <NotFoundPage />,
 children: [
 {
 element: (
 <PrivateRoute>
 <MainLayout />
 </PrivateRoute>
 ),

 children: [
 {
 index: true,
 element: (
 <RoleGuard allowedRoles={["ADMIN", "HOUSEKEEPING", "RECEPTIONIST"]}>
 <DashboardPage />
 </RoleGuard>
 ),
 },
 {
 path: "reports",
 element: (
 <RoleGuard allowedRoles={["ADMIN"]}>
 <ReportPage />
 </RoleGuard>
 ),
 },
 {
 path: "rooms",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <RoomManagementPage />
 </RoleGuard>
 ),
 },
 {
 path: "room-type",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <RoomTypeManagementPage />
 </RoleGuard>
 ),
 },
 {
 path: "room-config",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <RoomConfigPage />
 </RoleGuard>
 ),
 },
 {
 path: "housekeeping",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "HOUSEKEEPING"]}>
 <HousekeepingPage />
 </RoleGuard>
 ),
 },
 {
 path: "bookings",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <BookingManagementPage />
 </RoleGuard>
 ),
 },
 {
 path: "customers",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <CustomerManagementPage />
 </RoleGuard>
 ),
 },
 {
 path: "invoices",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <InvoicesPage />
 </RoleGuard>
 ),
 },
 {
 path: "services",
 element: (
 <RoleGuard allowedRoles={["ADMIN", "RECEPTIONIST"]}>
 <ServiceManagementPage />
 </RoleGuard>
 ),
 },
 {
 path: "users",
 element: (
 <RoleGuard allowedRoles={["ADMIN"]}>
 <UserPage />
 </RoleGuard>
 ),
 },
 ],
 },
 {
 path: "login",
 element: (
 <PublicRoute>
 <LoginPage />,
 </PublicRoute>
 ),
 },
 ],
 },
]);
