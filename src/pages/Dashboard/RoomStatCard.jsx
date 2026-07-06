import React from "react";
import { DoorOpen, Users, Sparkles, Wrench } from "lucide-react";

export const ROOM_STATUS = {
  available: {
    label: "Trống",
    icon: DoorOpen,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.05)",
    border: "rgba(167,139,250,0.15)",
  },
  occupied: {
    label: "Đang ở",
    icon: Users,
    color: "#f472b6",
    bg: "rgba(244,114,182,0.05)",
    border: "rgba(244,114,182,0.15)",
  },
  cleaning: {
    label: "Dọn dẹp",
    icon: Sparkles,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.05)",
    border: "rgba(96,165,250,0.15)",
  },
  maintenance: {
    label: "Bảo trì",
    icon: Wrench,
    color: "#f87171",
    bg: "rgba(248,113,113,0.05)",
    border: "rgba(248,113,113,0.15)",
  },
};

const RoomStatCard = ({ statusKey, count }) => {
  const cfg = ROOM_STATUS[statusKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  // Nhấn mạnh nếu là dọn dẹp hoặc bảo trì và có số lượng > 0
  const isUrgent =
    (statusKey === "cleaning" || statusKey === "maintenance") && count > 0;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-[8px] border transition-all duration-200 hover:-translate-y-0.5 ${isUrgent ? "animate-pulse" : ""}`}
      style={{
        background: cfg.bg,
        borderColor: isUrgent ? cfg.color : cfg.border,
      }}
    >
      <div
        className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0"
        style={{ background: `${cfg.color}15` }}
      >
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-zinc-300 truncate">{cfg.label}</p>
        <p
          className="text-base font-semibold font-mono leading-tight"
          style={{ color: cfg.color }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

export default RoomStatCard;
