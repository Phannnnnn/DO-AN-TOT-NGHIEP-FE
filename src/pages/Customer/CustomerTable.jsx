import { Info, Edit, Trash2 } from "lucide-react";

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <Info size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-medium">Không tìm thấy người dùng nào.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden bg-[#120d1e]/40">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-4xl">
          {/* Header */}
          <div className="grid grid-cols-[4rem_1fr_8rem_8rem_8rem_7rem] gap-4 px-5 py-3 items-center border-b border-white/[0.06] bg-white/[0.01]">
            {["ID", "Họ tên", "SĐT", "Quốc tịch", "Ngày sinh", ""].map(
              (h, i) => (
                <p
                  key={i}
                  className={`text-[10px] uppercase tracking-wider font-medium text-zinc-500 ${
                    i === 5 ? "text-right" : ""
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
              className={`grid grid-cols-[4rem_1fr_8rem_8rem_8rem_7rem] gap-4 px-5 py-3 items-center transition-colors hover:bg-white/[0.02] ${
                i !== customers.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <p className="text-xs text-zinc-500 font-mono">
                #{customer.customerId}
              </p>

              <div>
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {customer.fullName}
                </p>
                {customer.email && (
                  <p className="text-xs text-zinc-500 mt-0.5 truncate font-mono">
                    {customer.email}
                  </p>
                )}
              </div>

              <p className="text-xs text-zinc-400 font-mono">
                {customer.phone || ""}
              </p>

              <p className="text-xs text-zinc-400">
                {customer.nationality || ""}
              </p>

              <p className="text-xs text-zinc-500 font-mono">
                {formatDate(customer.dateOfBirth)}
              </p>

              <div
                className="flex items-center justify-end gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(customer)}
                  className="p-1.5 rounded-[6px] border border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200 transition-all cursor-pointer active:scale-[0.95]"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => onDelete(customer)}
                  className="p-1.5 rounded-[6px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer active:scale-[0.95]"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
