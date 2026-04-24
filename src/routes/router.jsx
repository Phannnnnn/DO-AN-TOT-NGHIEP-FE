import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import MainLayout from "../layouts/mainLayout/MainLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import RoomManagementPage from "../pages/RoomManagement/RoomManagementPage";
import BookingPage from "../pages/Booking/BookingPage";
import CustomersPage from "../pages/Customers/CustomersPage";
import ServicesPage from "../pages/Services/ServicesPage";
import InvoicesPage from "../pages/Invoices/InvoicesPage";
import InvoiceDetailPage from "../pages/Invoices/InvoiceDetailPage";
import App from "../App";
import LoginPage from "@/pages/Auth/LoginPage";
import { PrivateRoute } from "@/guards/PrivateRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import RoomTypePage from "@/pages/RoomType/RoomTypePage";
import RoomTypeDetailPage from "@/pages/RoomType/RoomTypeDetailPage";

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
          { path: "rooms", element: <RoomManagementPage /> },
          { path: "room-type", element: <RoomTypePage /> },
          { path: "room-type/:id", element: <RoomTypeDetailPage /> },
          { path: "bookings", element: <BookingPage /> },
          { path: "customers", element: <CustomersPage /> },
          { path: "invoices", element: <InvoicesPage /> },
          { path: "invoices/:id", element: <InvoiceDetailPage /> },
          { path: "services", element: <ServicesPage /> },
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
