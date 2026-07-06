import React from "react";
import { User, Clock } from "lucide-react";

export const STATUS_MAP = {
  PENDING: {
    label: "Chờ dọn",
    bg: "rgba(59, 130, 246, 0.08)",
    text: "rgb(147, 197, 253)",
    border: "rgba(59, 130, 246, 0.2)",
    accent: "#3b82f6",
  },
  IN_PROGRESS: {
    label: "Đang dọn",
    bg: "rgba(249, 115, 22, 0.08)",
    text: "rgb(253, 186, 116)",
    border: "rgba(249, 115, 22, 0.2)",
    accent: "#f97316",
  },
};

const TaskCard = ({ task, currentUser, onClaim, onComplete }) => {
  const status = STATUS_MAP[task.status] || {
    label: task.status,
    bg: "rgba(255, 255, 255, 0.05)",
    text: "#fff",
    border: "rgba(255, 255, 255, 0.1)",
    accent: "#aaa",
  };
  const isPending = task.status === "PENDING";
  const isAssignee = task.assignedTo === currentUser?.id;

  const formatTime = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const elapsed = task.startedAt
    ? Math.floor((Date.now() - new Date(task.startedAt)) / 60000)
    : null;

  console.log(elapsed);

  return (
    <div className="relative group overflow-hidden flex flex-col min-h-[190px] rounded-[8px] p-5 transition-all duration-200 hover:-translate-y-0.5 bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:border-white/[0.12]">
      {/* Status accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[8px]"
        style={{ background: status.accent }}
      />

      {/* Room number + status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-0.5">
            Phòng
          </p>
          <h4 className="text-2xl font-semibold leading-none text-zinc-100 font-mono group-hover:text-violet-400 transition-colors">
            {task.room?.roomNumber ?? "—"}
          </h4>
        </div>
        <span
          className="px-2 py-0.5 rounded-[4px] text-[11px] font-medium border"
          style={{
            background: status.bg,
            color: status.text,
            borderColor: status.border,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Floor */}
      <p className="text-xs font-medium text-zinc-500 mb-3">
        Tầng{" "}
        <span className="font-mono text-zinc-400">
          {task.room?.floor ?? "—"}
        </span>
      </p>

      {/* Assigned user */}
      {task.assignedUser && (
        <div className="flex items-center gap-1.5 mb-2">
          <User size={10} className="text-violet-400" />
          <span className="text-xs text-zinc-400 font-medium">
            Người dọn:{" "}
            {task.assignedUser.customer?.fullName ??
              task.assignedUser.userName ??
              `#${task.assignedTo}`}
          </span>
        </div>
      )}

      {/* Elapsed time */}
      {elapsed !== null && (
        <div className="flex items-center gap-1.5 mb-3">
          <Clock size={10} className="text-orange-400/80" />
          <span className="text-xs text-orange-400/80 font-mono font-medium">
            {elapsed < 60
              ? `${elapsed} phút`
              : `${Math.floor(elapsed / 60)}h ${elapsed % 60}p`}
          </span>
          {task.startedAt && (
            <span className="text-xs text-zinc-500 font-mono">
              từ {formatTime(task.startedAt)}
            </span>
          )}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto pt-3 border-t border-white/[0.05]">
        {isPending ? (
          <button
            onClick={onClaim}
            className="w-full h-8 rounded-[6px] text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer active:scale-[0.97]"
          >
            Nhận dọn
          </button>
        ) : isAssignee ? (
          <button
            onClick={onComplete}
            className="w-full h-8 rounded-[6px] text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer active:scale-[0.97]"
          >
            Hoàn thành
          </button>
        ) : (
          <div className="w-full h-8 flex items-center justify-center text-xs font-medium text-zinc-500 bg-white/[0.02] border border-white/[0.04] rounded-[6px] select-none">
            Đang dọn...
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
