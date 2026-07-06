import { Clock, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";

export const BOOKING_STATUS = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.05)",
    border: "rgba(251,191,36,0.15)",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: CalendarCheck,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.05)",
    border: "rgba(167,139,250,0.15)",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "#f472b6",
    bg: "rgba(244,114,182,0.05)",
    border: "rgba(244,114,182,0.15)",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.05)",
    border: "rgba(156,163,175,0.15)",
  },
};

const BookingStatCard = ({ statusKey, count }) => {
  const cfg = BOOKING_STATUS[statusKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-[8px] border transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: cfg.bg, borderColor: cfg.border }}
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

export default BookingStatCard;
