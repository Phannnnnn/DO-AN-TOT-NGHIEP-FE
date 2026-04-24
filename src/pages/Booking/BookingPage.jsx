import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";

const BookingPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = [
    { id: "all", label: "Tất cả", count: 68 },
    { id: "pending", label: "Chờ check-in", count: 8 },
    { id: "checked-in", label: "Đang ở", count: 15 },
    { id: "completed", label: "Đã trả phòng", count: 42 },
    { id: "cancelled", label: "Đã hủy", count: 3 },
  ];

  const statusColors = {
    "chờ check-in": "bg-yellow-100 text-yellow-800",
    "đang ở": "bg-green-100 text-green-800",
    "đã trả phòng": "bg-blue-100 text-blue-800",
    "đã hủy": "bg-red-100 text-red-800",
  };

  const statusBadgeColors = {
    "chờ check-in": "bg-yellow-500",
    "đang ở": "bg-green-500",
    "đã trả phòng": "bg-blue-500",
    "đã hủy": "bg-red-500",
  };

  const bookings = [
    {
      id: "#BK-9921",
      customer: {
        name: "Trần Minh Quân",
        phone: "0987654321",
        avatar: "TM",
      },
      room: "402",
      type: "Deluxe Sea View",
      checkIn: "24/10/2023",
      checkOut: "26/10/2023",
      nights: 2,
      total: "2,400,000đ",
      status: "chờ check-in",
      action: "chờ check-in",
    },
    {
      id: "#BK-8945",
      customer: {
        name: "Lê ThảoMai Anh",
        phone: "0981 888 9999",
        avatar: "LT",
      },
      room: "105",
      type: "Standard King",
      checkIn: "22/10/2023",
      checkOut: "25/10/2023",
      nights: 3,
      total: "3,600,000đ",
      status: "đang ở",
      action: "check-out",
    },
    {
      id: "#BK-8832",
      customer: {
        name: "Phạm Hoàng Nam",
        phone: "098 785 4321",
        avatar: "PN",
      },
      room: "308",
      type: "Suite Terrace",
      checkIn: "20/10/2023",
      checkOut: "23/10/2023",
      nights: 3,
      total: "5,400,000đ",
      status: "đã trả phòng",
      action: "view",
    },
    {
      id: "#BK-8810",
      customer: {
        name: "Vũ Tuyết Mai",
        phone: "0987 123 4321",
        avatar: "VT",
      },
      room: "201",
      type: "Twin Standard",
      checkIn: "21/10/2023",
      checkOut: "22/10/2023",
      nights: 1,
      total: "800,000đ",
      status: "đã hủy",
      action: "delete",
    },
    {
      id: "#BK-8998",
      customer: {
        name: "Đặng Ngọc Hà",
        phone: "0987 666 0000",
        avatar: "DN",
      },
      room: "501",
      type: "Penthouse View",
      checkIn: "23/10/2023",
      checkOut: "27/10/2023",
      nights: 4,
      total: "12,000,000đ",
      status: "đang ở",
      action: "check-out",
    },
  ];

  // Hàm lọc đặt phòng
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Lọc theo trạng thái
    if (activeFilter !== "all") {
      const statusMap = {
        pending: "chờ check-in",
        "checked-in": "đang ở",
        completed: "đã trả phòng",
        cancelled: "đã hủy",
      };
      filtered = filtered.filter(
        (booking) => booking.status === statusMap[activeFilter],
      );
    }

    // Lọc theo tìm kiếm
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(term) ||
          booking.customer.name.toLowerCase().includes(term) ||
          booking.room.toString().includes(term),
      );
    }

    return filtered;
  };

  const ActionButton = ({ action }) => {
    switch (action) {
      case "chờ check-in":
        return (
          <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
            Chờ check-in
          </button>
        );
      case "check-out":
        return (
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            Check-out
          </button>
        );
      case "view":
        return (
          <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
            Xem
          </button>
        );
      case "delete":
        return (
          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
            Xóa
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header trống */}
      <div className="mb-6"></div>

      {/* Search và Add Booking */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm mã đặt phòng, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tạo booking mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  KHÁCH HÀNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  PHÒNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  LOẠI PHÒNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  CHECK-IN
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  CHECK-OUT
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  ĐÊM
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  TỔNG TIỀN
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  HÀNH ĐỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredBookings().length > 0 ? (
                getFilteredBookings().map((booking, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          {booking.customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {booking.customer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.checkIn}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.checkOut}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      {booking.nights}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {booking.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[booking.status]
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ActionButton action={booking.action} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy đặt phòng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {getFilteredBookings().length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị 1 - 10 trong {getFilteredBookings().length} kết quả
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
              ←
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
