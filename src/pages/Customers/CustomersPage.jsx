import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[280px] animate-slide-in
        ${t.type === "success" ? "bg-green-500" : "bg-red-500"}`}
      >
        {t.type === "success" ? (
          <Check className="w-4 h-4 flex-shrink-0" />
        ) : (
          <X className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-sm font-medium flex-1">{t.message}</span>
        <button
          onClick={() => removeToast(t.id)}
          className="opacity-70 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return {
    toasts,
    toast: { success: (m) => add(m, "success"), error: (m) => add(m, "error") },
    remove,
  };
};

// ── ActiveBadge ───────────────────────────────────────────────────────────────
const ActiveBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
    ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
    />
    {isActive ? "Kích hoạt" : "Vô hiệu"}
  </span>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
    <span
      className={`text-sm font-medium ${value ? "text-green-600" : "text-gray-400"}`}
    >
      {value ? "Kích hoạt" : "Vô hiệu hóa"}
    </span>
  </div>
);

// ── Delete Modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ customer, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
        Xác nhận xóa
      </h3>
      <p className="text-sm text-gray-500 text-center mb-1">
        Bạn có chắc muốn xóa người dùng
      </p>
      <p className="text-sm font-semibold text-gray-800 text-center mb-2">
        "{customer.name}"?
      </p>
      <p className="text-xs text-red-400 text-center mb-6">
        Hành động này không thể hoàn tác.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
);

// ── Form fields config ────────────────────────────────────────────────────────
const FIELDS = [
  {
    key: "name",
    label: "Họ và tên",
    type: "text",
    required: true,
    span: false,
  },
  {
    key: "phone",
    label: "Số điện thoại",
    type: "text",
    required: false,
    span: false,
  },
  { key: "email", label: "Email", type: "email", required: true, span: false },
  {
    key: "dob",
    label: "Ngày sinh",
    type: "text",
    required: false,
    span: false,
  },
  {
    key: "nationality",
    label: "Quốc tịch",
    type: "text",
    required: false,
    span: false,
  },
  {
    key: "address",
    label: "Địa chỉ",
    type: "text",
    required: false,
    span: true,
  },
];

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ customer, onSave, onClose }) => {
  const [form, setForm] = useState({ ...customer });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Chỉnh sửa người dùng
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">ID: {customer.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-5 p-3 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {form.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {form.name || "..."}
              </p>
              <p className="text-xs text-gray-400">{form.email || "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.span ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  {f.label}{" "}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Trạng thái tài khoản
              </label>
              <Toggle
                value={form.isActive}
                onChange={(v) => set("isActive", v)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Add Modal ─────────────────────────────────────────────────────────────────
const AddModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    nationality: "Việt Nam",
    address: "",
    isActive: true,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            Tạo mới người dùng
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.span ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                  {f.label}{" "}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Trạng thái tài khoản
              </label>
              <Toggle
                value={form.isActive}
                onChange={(v) => set("isActive", v)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo mới người dùng
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const CustomersPage = () => {
  const { toasts, toast, remove } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      phone: "0901 234 567",
      isActive: true,
      nationality: "Việt Nam",
      dateCreated: "12/05/2023",
      email: "an.nguyen@gmail.com",
      dob: "12/10/1992",
      address: "88 Láng Hạ, Đống Đa, Hà Nội",
      bookings: [
        {
          id: "#BK-8821",
          room: "Deluxe City View - Room 502",
          dates: "15/05/2023 - 17/05/2023",
          total: "3,500,000đ",
          status: "hoàn thành",
        },
        {
          id: "#BK-8704",
          room: "Suite Ocean View - Room 801",
          dates: "20/04/2023 - 22/04/2023",
          total: "5,200,000đ",
          status: "hủy bỏ",
        },
      ],
    },
    {
      id: 2,
      name: "Trần Thị Bích Ngọc",
      phone: "0912 345 678",
      isActive: true,
      nationality: "Việt Nam",
      dateCreated: "15/05/2023",
      email: "bichngoc.tran@gmail.com",
      dob: "08/03/1995",
      address: "45 Nguyễn Huệ, Quận 1, TP HCM",
      bookings: [
        {
          id: "#BK-8765",
          room: "Presidential Suite - Room 1001",
          dates: "01/06/2023 - 05/06/2023",
          total: "8,500,000đ",
          status: "hoàn thành",
        },
      ],
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      phone: "0987 654 321",
      isActive: false,
      nationality: "Việt Nam",
      dateCreated: "20/05/2023",
      email: "lhoangnam@gmail.com",
      dob: "10/07/1990",
      address: "123 Trần Hưng Đạo, Hải Phòng",
      bookings: [
        {
          id: "#BK-8654",
          room: "Deluxe Sea View - Room 402",
          dates: "25/05/2023 - 28/05/2023",
          total: "4,200,000đ",
          status: "hoàn thành",
        },
      ],
    },
    {
      id: 4,
      name: "Jonathan Smith",
      phone: "+1 202 555 0123",
      isActive: true,
      nationality: "Hoa Kỳ",
      dateCreated: "22/05/2023",
      email: "jonathan.smith@email.com",
      dob: "15/12/1985",
      address: "456 Main Street, New York, USA",
      bookings: [
        {
          id: "#BK-8543",
          room: "Suite Terrace - Room 308",
          dates: "10/06/2023 - 15/06/2023",
          total: "6,500,000đ",
          status: "hoàn thành",
        },
      ],
    },
  ]);

  const handleSaveEdit = (updated) => {
    setCustomers((p) =>
      p.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
    );
    if (selectedCustomer?.id === updated.id)
      setSelectedCustomer({ ...selectedCustomer, ...updated });
    setEditTarget(null);
    toast.success(`Đã cập nhật "${updated.name}"`);
  };

  const handleDelete = () => {
    const name = deleteTarget.name;
    setCustomers((p) => p.filter((c) => c.id !== deleteTarget.id));
    if (selectedCustomer?.id === deleteTarget.id) setSelectedCustomer(null);
    setDeleteTarget(null);
    toast.success(`Đã xóa người dùng "${name}"`);
  };

  const handleAdd = (form) => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Vui lòng nhập Họ tên và Email");
      return;
    }
    setCustomers((p) => [
      {
        ...form,
        id: Date.now(),
        dateCreated: new Date().toLocaleDateString("vi-VN"),
        bookings: [],
      },
      ...p,
    ]);
    setShowAdd(false);
    toast.success(`Đã thêm "${form.name}"`);
  };

  const filtered = customers.filter((c) => {
    const t = searchTerm.toLowerCase();
    const matchSearch =
      !t ||
      c.name.toLowerCase().includes(t) ||
      c.email.toLowerCase().includes(t) ||
      c.phone.toLowerCase().includes(t);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? c.isActive : !c.isActive);
    return matchSearch && matchStatus;
  });

  const bkColor = (s) =>
    s === "hoàn thành"
      ? "bg-green-100 text-green-700"
      : s === "hủy bỏ"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-700";

  const filterBtns = [
    { key: "all", label: "Tất cả", count: customers.length },
    {
      key: "active",
      label: "Kích hoạt",
      count: customers.filter((c) => c.isActive).length,
    },
    {
      key: "inactive",
      label: "Vô hiệu",
      count: customers.filter((c) => !c.isActive).length,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast toasts={toasts} removeToast={remove} />
      {editTarget && (
        <EditModal
          customer={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          customer={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAdd && (
        <AddModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
          {filterBtns.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${statusFilter === btn.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {btn.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${statusFilter === btn.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Tạo mới người dùng
        </button>
      </div>

      {(searchTerm || statusFilter !== "all") && (
        <p className="text-sm text-gray-400 mb-3">
          Tìm thấy{" "}
          <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
          kết quả
          {statusFilter !== "all" && (
            <>
              {" "}
              · Lọc:{" "}
              <span className="text-blue-600">
                {filterBtns.find((b) => b.key === statusFilter)?.label}
              </span>
            </>
          )}
        </p>
      )}

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "STT",
                      "HỌ VÀ TÊN",
                      "EMAIL",
                      "SỐ ĐIỆN THOẠI",
                      "QUỐC TỊCH",
                      "TRẠNG THÁI",
                      "NGÀY TẠO",
                      "HÀNH ĐỘNG",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length > 0 ? (
                    filtered.map((c, i) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className={`hover:bg-blue-50 transition-colors cursor-pointer ${selectedCustomer?.id === c.id ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                            ${c.isActive ? "bg-blue-600" : "bg-gray-400"}`}
                            >
                              {c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {c.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {c.phone}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {c.nationality}
                        </td>
                        <td className="px-4 py-3">
                          <ActiveBadge isActive={c.isActive} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {c.dateCreated}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setSelectedCustomer(c)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Xem"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => setEditTarget(c)}
                              className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(c)}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-gray-400 text-sm"
                      >
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedCustomer && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-6">
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0
                  ${selectedCustomer.isActive ? "bg-blue-600" : "bg-gray-400"}`}
                >
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    {selectedCustomer.name}
                  </h2>
                  <div className="mt-1">
                    <ActiveBadge isActive={selectedCustomer.isActive} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b border-gray-100 mb-4">
                {[
                  ["EMAIL", selectedCustomer.email],
                  ["ĐIỆN THOẠI", selectedCustomer.phone],
                  ["NGÀY SINH", selectedCustomer.dob],
                  ["QUỐC TỊCH", selectedCustomer.nationality],
                  ["ĐỊA CHỈ", selectedCustomer.address],
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      {lbl}
                    </p>
                    <p className="text-sm text-gray-800">{val || "—"}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{" "}
                  Đặt phòng gần đây
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {selectedCustomer.bookings.length > 0 ? (
                    selectedCustomer.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs text-gray-800">
                            {b.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${bkColor(b.status)}`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-0.5">{b.room}</p>
                        <p className="text-xs text-gray-400">{b.dates}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {b.total}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-3">
                      Chưa có đặt phòng
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditTarget(selectedCustomer)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Sửa
                </button>
                <button
                  onClick={() => setDeleteTarget(selectedCustomer)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fade-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        .animate-slide-in{animation:slide-in .25s ease both}
        .animate-fade-in{animation:fade-in .2s ease both}
      `}</style>
    </div>
  );
};

export default CustomersPage;
