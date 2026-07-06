import ActiveLabel from "@/components/common/ActiveLabel";
import { Info, Edit, Trash2, KeyRound } from "lucide-react";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    text: "text-violet-400",
  },
  USER: {
    label: "Người dùng",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
    text: "text-sky-400",
  },
  HOUSEKEEPING: {
    label: "Buồng phòng",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  RECEPTIONIST: {
    label: "Lễ tân",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
};

const UserTable = ({ users, onEdit, onDelete, onResetPassword }) => {
  if (users.length === 0) {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden bg-[#120d1e]/40">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-5xl">
          {/* Header */}
          <div className="grid grid-cols-[3.5rem_1fr_1fr_7rem_6rem_9rem_8rem] gap-4 px-5 py-3 items-center border-b border-white/[0.06] bg-white/[0.01]">
            {[
              "ID",
              "Tên đăng nhập",
              "Thông tin",
              "Vai trò",
              "Trạng thái",
              "Đăng nhập gần nhất",
              "",
            ].map((h, i) => (
              <p
                key={i}
                className={`text-[10px] uppercase tracking-wider font-medium text-zinc-500 ${
                  i === 6 ? "text-right" : ""
                }`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {users.map((user, i) => {
            const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.USER;

            return (
              <div
                key={user.id}
                className={`grid grid-cols-[3.5rem_1fr_1fr_7rem_6rem_9rem_8rem] gap-4 px-5 py-3 items-center transition-colors hover:bg-white/[0.02] ${
                  i !== users.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                {/* ID */}
                <p className="text-xs text-zinc-500 font-mono">#{user.id}</p>

                {/* Username */}
                <div>
                  <p className="text-sm font-medium text-zinc-200 truncate font-mono">
                    {user.userName}
                  </p>
                </div>

                {/* Customer info */}
                <div>
                  <p className="text-xs font-medium text-zinc-300 truncate">
                    {user.customer?.fullName || ""}
                  </p>
                  {user.customer?.email && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate font-mono">
                      {user.customer.email}
                    </p>
                  )}
                </div>

                {/* Role badge */}
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${role.bg} ${role.border} ${role.text}`}
                  >
                    {role.label}
                  </span>
                </div>

                {/* Status */}
                <ActiveLabel isActive={user.isActive} />

                {/* Last login */}
                <p className="text-xs text-zinc-500 font-mono">
                  {formatDate(user.lastLogin)}
                </p>

                {/* Actions */}
                <div
                  className="flex items-center justify-end gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.role !== "ADMIN" ? (
                    <>
                      <button
                        onClick={() => onEdit(user)}
                        title="Sửa"
                        className="p-1.5 rounded-[6px] border border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200 transition-all cursor-pointer active:scale-[0.95]"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => onResetPassword(user)}
                        title="Đặt lại mật khẩu"
                        className="p-1.5 rounded-[6px] border border-sky-500/20 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200 transition-all cursor-pointer active:scale-[0.95]"
                      >
                        <KeyRound size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        title="Xóa"
                        className="p-1.5 rounded-[6px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer active:scale-[0.95]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-zinc-500 italic pr-3 font-medium"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
