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
import RoomTypeManagementPage from "@/pages/RoomType/RoomTypeManagementPage";
import RoomConfigPage from "@/pages/RoomConFig/RoomConfigPage";
import ReportPage from "@/pages/Report/ReportPage";
import HousekeepingPage from "@/pages/Housekeeping/HousekeepingPage";
import StaffPage from "@/pages/Staff/StaffPage";
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
          { index: true, element: <DashboardPage /> },
          { path: "reports", element: <ReportPage /> },
          { path: "rooms", element: <RoomManagementPage /> },
          { path: "room-type", element: <RoomTypeManagementPage /> },
          { path: "room-config", element: <RoomConfigPage /> },
          { path: "housekeeping", element: <HousekeepingPage /> },
          { path: "bookings", element: <BookingManagementPage /> },
          { path: "customers", element: <CustomerManagementPage /> },
          { path: "invoices", element: <InvoicesPage /> },
          { path: "services", element: <ServiceManagementPage /> },
          { path: "staff", element: <StaffPage /> },
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
