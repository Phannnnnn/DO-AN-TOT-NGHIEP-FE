import { Info, Edit, Trash2 } from "lucide-react";

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <Info size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-black uppercase tracking-widest">
          Không tìm thấy người dùng nào.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[4rem_1fr_8rem_8rem_8rem_8rem_7rem] gap-4 px-5 py-3.5 items-center border-b border-white/[0.06] bg-white/[0.02]">
        {["ID", "Họ tên", "CCCD/CMND", "SĐT", "Quốc tịch", "Ngày sinh", ""].map(
          (h, i) => (
            <p
              key={i}
              className={`text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] ${
                i === 6 ? "text-right" : ""
              }`}
            >
              {h}
            </p>
          ),
        )}
      </div>

      {/* Rows */}
      {customers.map((customer, i) => (
        <div
          key={customer.customerId}
          className={`grid grid-cols-[4rem_1fr_8rem_8rem_8rem_8rem_7rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] ${
            i !== customers.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-[11px] text-gray-700 font-bold">
            #{customer.customerId}
          </p>

          <div>
            <p className="text-[13px] font-semibold text-gray-200 truncate">
              {customer.fullName}
            </p>
            {customer.email && (
              <p className="text-[10px] text-gray-600 mt-0.5 truncate">
                {customer.email}
              </p>
            )}
          </div>

          <p className="text-[12px] text-gray-400 font-mono">
            {customer.idNumber}
          </p>

          <p className="text-[12px] text-gray-400">{customer.phone}</p>

          <p className="text-[12px] text-gray-400">{customer.nationality}</p>

          <p className="text-[11px] text-gray-500">
            {formatDate(customer.dateOfBirth)}
          </p>

          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(customer)}
              className="p-1.5 rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all cursor-pointer"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete(customer)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerTable;
