import React, { useState } from "react";
import { Plus, Search, Eye, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusColors = {
    "đã thanh toán": "bg-green-100 text-green-800",
    "chờ thanh toán": "bg-yellow-100 text-yellow-800",
    "quá hạn": "bg-red-100 text-red-800",
  };

  const statusBadges = {
    "đã thanh toán": "bg-emerald-500",
    "chờ thanh toán": "bg-amber-500",
    "quá hạn": "bg-red-500",
  };

  const invoices = [
    {
      id: "HD-2024-001",
      customer: "Nguyễn Văn An",
      room: "P.302 (Deluxe)",
      date: "20/05/2024",
      roomCharge: 1500000,
      service: 250000,
      vat: 175000,
      total: 1925000,
      status: "đã thanh toán",
    },
    {
      id: "HD-2024-002",
      customer: "Trần Thị Bích",
      room: "P.405 (Suite)",
      date: "21/05/2024",
      roomCharge: 3200000,
      service: 850000,
      vat: 405000,
      total: 4455000,
      status: "chờ thanh toán",
    },
    {
      id: "HD-2024-003",
      customer: "Lê Hoàng Nam",
      room: "P.201 (Standard)",
      date: "21/05/2024",
      roomCharge: 800000,
      service: 0,
      vat: 80000,
      total: 880000,
      status: "đã thanh toán",
    },
    {
      id: "HD-2024-004",
      customer: "Phạm Minh Tuấn",
      room: "P.505 (Penthouse)",
      date: "22/05/2024",
      roomCharge: 12000000,
      service: 2400000,
      vat: 1440000,
      total: 15840000,
      status: "chờ thanh toán",
    },
    {
      id: "HD-2024-005",
      customer: "Đặng Ngọc Hà",
      room: "P.501 (Penthouse)",
      date: "23/05/2024",
      roomCharge: 8500000,
      service: 1200000,
      vat: 970000,
      total: 10670000,
      status: "đã thanh toán",
    },
  ];

  const getFilteredInvoices = () => {
    let filtered = invoices;

    // Lọc theo trạng thái
    if (activeStatus !== "all") {
      filtered = filtered.filter((inv) => inv.status === activeStatus);
    }

    // Lọc theo tìm kiếm
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.id.toLowerCase().includes(term) ||
          inv.customer.toLowerCase().includes(term) ||
          inv.room.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  const calculateStats = () => {
    const filtered = getFilteredInvoices();
    const totalRevenue = filtered.reduce((sum, inv) => sum + inv.total, 0);
    const paid = filtered
      .filter((inv) => inv.status === "đã thanh toán")
      .reduce((sum, inv) => sum + inv.total, 0);
    const pending = filtered
      .filter((inv) => inv.status === "chờ thanh toán")
      .reduce((sum, inv) => sum + inv.total, 0);

    return { totalRevenue, paid, pending };
  };

  const stats = calculateStats();
  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header trống */}
      <div className="mb-6"></div>

      {/* Title and Action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
          <p className="text-sm text-gray-600 mt-1">
            Xem lại quản lý từ chối các hóa đơn thanh toán từ khách hàng
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tạo hóa đơn
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm mã hóa đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
          <option>Trạng thái: Tất cả</option>
          <option>Đã thanh toán</option>
          <option>Chờ thanh toán</option>
        </select>
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  MÃ HĐ
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  KHÁCH HÀNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  PHÒNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  NGÀY TẠO
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  TIỀN PHÒNG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  DỊCH VỤ
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  VAT
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  TỔNG CỘNG
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.room}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.roomCharge.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.service.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {invoice.vat.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {invoice.total.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[invoice.status]
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy hóa đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Hiển thị 1 - 4 trong {filteredInvoices.length} hóa đơn
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

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Tổng doanh thu
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalRevenue.toLocaleString()}đ
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Đã thanh toán
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.paid.toLocaleString()}đ
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Chưa thanh toán
              </p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.pending.toLocaleString()}đ
              </p>
            </div>
            <div className="p-4 bg-amber-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
