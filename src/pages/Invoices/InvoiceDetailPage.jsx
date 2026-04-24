import React, { useState } from "react";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const invoice = {
    id: "HD-2024-001",
    date: "20/05/2024",
    status: "đã thanh toán",
    hotel: {
      name: "Luxe Hotel",
      address: "123 Đường ABC, Quận 1, TP. HCM",
      phone: "028 1234 5678",
    },
    customer: {
      name: "Nguyễn Văn A",
      cccd: "0123456789",
      address: "Hà Nội",
    },
    room: {
      number: "203",
      type: "Deluxe Sea View",
      checkIn: "01/07",
      checkOut: "03/07/2024",
      nights: 2,
    },
    roomCharges: [
      {
        name: "Deluxe Sea View - Room 203",
        quantity: 2,
        price: 1500000,
        total: 3000000,
      },
    ],
    services: [
      {
        name: "Giặt ủi (Laundry)",
        quantity: 1,
        price: 150000,
        total: 150000,
      },
      {
        name: "Mini Bar (Nước ngọt, snack)",
        quantity: 3,
        price: 50000,
        total: 150000,
      },
      {
        name: "Dịch vụ vệ sinh sân bay",
        quantity: 1,
        price: 300000,
        total: 300000,
      },
    ],
    subtotal: 3600000,
    vat: 360000,
    total: 3960000,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer className="w-5 h-5" />
            In hóa đơn
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="border-b border-gray-300 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold">
                🏨
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  HÓA ĐƠN DỊCH VỤ
                </h1>
                <p className="text-sm text-gray-600">Mã: {invoice.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Ngày tạo: {invoice.date}</p>
              <p
                className={`text-sm font-semibold ${
                  invoice.status === "đã thanh toán"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Trạng thái: {invoice.status.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer and Hotel Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-b-2 border-blue-600">
              Thông tin khách sạn
            </h3>
            <p className="font-semibold text-gray-800 mb-2">
              {invoice.hotel.name}
            </p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>📍 {invoice.hotel.address}</p>
              <p>📞 {invoice.hotel.phone}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-b-2 border-blue-600">
              Thông tin khách hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Họ tên:</p>
                <p className="font-semibold text-gray-800">
                  {invoice.customer.name}
                </p>
              </div>
              <div>
                <p className="text-gray-600">CCCD:</p>
                <p className="font-semibold text-gray-800">
                  {invoice.customer.cccd}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Địa chỉ:</p>
                <p className="font-semibold text-gray-800">
                  {invoice.customer.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold mb-1">
                Phòng
              </p>
              <p className="text-lg font-bold text-gray-800">
                {invoice.room.number}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold mb-1">
                Loại phòng
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {invoice.room.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold mb-1">
                Thời gian
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {invoice.room.checkIn} - {invoice.room.checkOut}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-bold mb-1">
                Số đêm
              </p>
              <p className="text-lg font-bold text-gray-800">
                {invoice.room.nights} đêm
              </p>
            </div>
          </div>
        </div>

        {/* Room Charges */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-l-4 border-blue-600 pl-2">
            Chi tiết tiền phòng
          </h3>
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-100 border-b border-gray-300 text-xs font-bold text-gray-700 uppercase">
              <div className="px-4 py-3">Loại phòng</div>
              <div className="px-4 py-3 text-center">Số đêm</div>
              <div className="px-4 py-3 text-right">Đơn giá</div>
              <div className="px-4 py-3 text-right">Thành tiền</div>
            </div>
            {invoice.roomCharges.map((charge, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 border-b border-gray-200 text-sm"
              >
                <div className="px-4 py-3 text-gray-800">{charge.name}</div>
                <div className="px-4 py-3 text-center text-gray-800">
                  {charge.quantity}
                </div>
                <div className="px-4 py-3 text-right text-gray-800">
                  {charge.price.toLocaleString()}đ
                </div>
                <div className="px-4 py-3 text-right font-semibold text-gray-800">
                  {charge.total.toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-l-4 border-blue-600 pl-2">
            Dịch vụ phát sinh
          </h3>
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-100 border-b border-gray-300 text-xs font-bold text-gray-700 uppercase">
              <div className="px-4 py-3">Tên dịch vụ</div>
              <div className="px-4 py-3 text-center">Sl</div>
              <div className="px-4 py-3 text-right">Đơn giá</div>
              <div className="px-4 py-3 text-right">Thành tiền</div>
            </div>
            {invoice.services.map((service, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 border-b border-gray-200 text-sm"
              >
                <div className="px-4 py-3 text-gray-800">{service.name}</div>
                <div className="px-4 py-3 text-center text-gray-800">
                  {service.quantity}
                </div>
                <div className="px-4 py-3 text-right text-gray-800">
                  {service.price.toLocaleString()}đ
                </div>
                <div className="px-4 py-3 text-right font-semibold text-gray-800">
                  {service.total.toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods and Summary */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-b-2 border-blue-600">
              Phương thức thanh toán
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">💵 Tiền mặt</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === "transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">🏦 Chuyển khoản</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">💳 Thẻ ngân hàng</span>
              </label>
            </div>
          </div>

          {/* Invoice Summary */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 pb-2 border-b-2 border-blue-600">
              Tính toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-800 font-medium">
                  {invoice.subtotal.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (10%):</span>
                <span className="text-gray-800 font-medium">
                  {invoice.vat.toLocaleString()}đ
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                <span className="text-lg font-bold text-gray-800">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {invoice.total.toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-semibold flex items-center gap-2">
            ✓ Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
