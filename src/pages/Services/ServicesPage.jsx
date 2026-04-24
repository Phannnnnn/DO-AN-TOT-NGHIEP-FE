import React, { useState } from "react";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const serviceCategories = [
    {
      id: 1,
      name: "Ăn uống",
      price: "từ 50,000đ",
      icon: "🍜",
      services: [
        { id: 1, name: "Phở bò Hà Nội", price: 75000 },
        { id: 2, name: "Cơm gà Hải Nam", price: 85000 },
        { id: 3, name: "Bánh mì nướng", price: 35000 },
      ],
    },
    {
      id: 2,
      name: "Giặt ủi",
      price: "từ 30,000đ",
      icon: "👔",
      services: [
        { id: 4, name: "Giặt ủi (50ml)", price: 40000 },
        { id: 5, name: "Giặt nhanh", price: 60000 },
      ],
    },
    {
      id: 3,
      name: "Minibar",
      price: "từ 20,000đ",
      icon: "🥤",
      services: [
        { id: 6, name: "Minibar (Pepsi)", price: 20000 },
        { id: 7, name: "Minibar (Nước cam)", price: 25000 },
        { id: 8, name: "Minibar (Bia)", price: 50000 },
      ],
    },
    {
      id: 4,
      name: "Dưa ôn",
      price: "từ 200,000đ",
      icon: "🚗",
      services: [
        { id: 9, name: "Taxi sân bay", price: 250000 },
        { id: 10, name: "Dưa ôn trong thành phố", price: 200000 },
      ],
    },
    {
      id: 5,
      name: "Spa & massage",
      price: "từ 300,000đ",
      icon: "💆",
      services: [
        { id: 11, name: "Massage tinh dầu", price: 300000 },
        { id: 12, name: "Massage body", price: 350000 },
        { id: 13, name: "Massage đầu & cổ", price: 200000 },
      ],
    },
  ];

  const bookings = [
    {
      id: "#BK-203",
      customerName: "Nguyễn Văn A",
      roomNumber: "203",
      checkIn: "01/07",
      checkOut: "03/07",
      services: [
        {
          id: 1,
          name: "Phở bò Hà Nội",
          quantity: 2,
          price: 75000,
          total: 150000,
          addedDate: "01/07, 08:30",
        },
        {
          id: 4,
          name: "Giặt ủi (50ml)",
          quantity: 2,
          price: 40000,
          total: 80000,
          addedDate: "01/07, 10:15",
        },
        {
          id: 6,
          name: "Minibar (Pepsi)",
          quantity: 3,
          price: 20000,
          total: 60000,
          addedDate: "02/07, 22:00",
        },
        {
          id: 11,
          name: "Massage tinh dầu",
          quantity: 1,
          price: 300000,
          total: 300000,
          addedDate: "02/07, 15:00",
        },
      ],
    },
  ];

  const currentBooking = selectedBooking || bookings[0];

  const calculateTotals = () => {
    const serviceTotal = currentBooking.services.reduce(
      (sum, s) => sum + s.total,
      0,
    );
    const roomCharge = 1600000;
    const vat = Math.floor((serviceTotal + roomCharge) * 0.1);
    const grandTotal = serviceTotal + roomCharge + vat;

    return {
      serviceTotal,
      roomCharge,
      vat,
      grandTotal,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header trống */}
      <div className="mb-6"></div>

      <div className="flex gap-6">
        {/* Left Panel - Service Categories */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Danh mục dịch vụ
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Quản lý và cập nhật các dịch vụ để sử dụng cho khách hàng
            </p>

            <div className="space-y-3">
              {serviceCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setActiveService(category.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    activeService === category.id
                      ? "bg-blue-50 border border-blue-500"
                      : "bg-gray-50 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <h3 className="font-semibold text-gray-800">
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {category.price}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full border border-dashed border-gray-300 py-3 rounded-lg hover:bg-gray-50 text-gray-600 font-medium mt-4 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Right Panel - Booking Services */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Dịch vụ theo booking
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">
                      {currentBooking.roomNumber}
                    </div>
                    <span className="text-gray-800 font-medium">
                      {currentBooking.customerName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Check-in: {currentBooking.checkIn} • Check-out:{" "}
                    {currentBooking.checkOut}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ĐÃ NHẬN PHÒNG
                  </span>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nhập số phòng hoặc tên khách..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
            </div>

            {/* Services Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      DỊCH VỤ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      SỐ LƯỢNG
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ĐƠN GIÁ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      THÀNH TIỀN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      NGÀY THÊM
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      HÀNH ĐỘNG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooking.services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {service.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-center">
                        {service.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {service.price.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                        {service.total.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {service.addedDate}
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Service Button */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm dịch vụ
            </button>
          </div>

          {/* Booking Info & Invoice */}
          <div className="grid grid-cols-2 gap-6">
            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Ưu chỉ booking</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phòng</span>
                  <span className="text-sm font-medium text-gray-800">
                    {currentBooking.roomNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loại phòng</span>
                  <span className="text-sm font-medium text-gray-800">
                    Deluxe
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Check-in</span>
                  <span className="text-sm font-medium text-gray-800">
                    {currentBooking.checkIn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Check-out</span>
                  <span className="text-sm font-medium text-gray-800">
                    {currentBooking.checkOut}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Thêm lưu ý về dịch vụ...
                </p>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                ></textarea>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Tính phí</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phòng</span>
                  <span className="text-sm font-medium text-gray-800">
                    {totals.roomCharge.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dịch vụ (4 mục)</span>
                  <span className="text-sm font-medium text-gray-800">
                    {totals.serviceTotal.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT (10%)</span>
                  <span className="text-sm font-medium text-gray-800">
                    {totals.vat.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totals.grandTotal.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Xác nhận thanh toán
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium">
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
