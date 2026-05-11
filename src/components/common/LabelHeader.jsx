import { useLocation } from "react-router-dom";

const LabelHeader = () => {
  const location = useLocation();
  const menuItems = [
    { id: 1, label: "Bảng điều khiển", path: "/" },
    { id: 2, label: "Quản lý phòng", path: "/rooms" },
    { id: 20, label: "Loại phòng", path: "/room-type" },
    { id: 22, label: "Tiện ích / giường", path: "/room-config" },
    { id: 3, label: "Đặt phòng", path: "/bookings" },
    { id: 4, label: "Người dùng", path: "/customers" },
    { id: 5, label: "Dịch vụ", path: "/services" },
    { id: 6, label: "Hóa đơn", path: "/invoices" },
    { id: 7, label: "Nhân sự", path: "/staff" },
    { id: 8, label: "Buồng phòng", path: "/housekeeping" },
    { id: 9, label: "Báo cáo", path: "/reports" },
  ];

  const currentPage = menuItems.find((item) => item.path === location.pathname);
  const labelHeader = currentPage ? currentPage.label : "Tổng quan";

  return (
    <h2 className="text-xs font-black text-[#4b5563] uppercase tracking-[0.15em]">
      {labelHeader}
    </h2>
  );
};

export default LabelHeader;
