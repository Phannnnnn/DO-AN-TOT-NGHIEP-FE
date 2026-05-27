import { dashboardService } from "@/services/dashboard/dashboardService";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  BedDouble,
  CalendarCheck,
  Users,
  DoorOpen,
  Sparkles,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  Activity,
} from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

// ── Helpers ──────────────────────────────────────────────────────────────────

const ROOM_STATUS = {
  available: {
    label: "Trống",
    icon: DoorOpen,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  occupied: {
    label: "Đang ở",
    icon: Users,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
  },
  cleaning: {
    label: "Dọn dẹp",
    icon: Sparkles,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  maintenance: {
    label: "Bảo trì",
    icon: Wrench,
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.25)",
  },
};

const BOOKING_STATUS = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: CalendarCheck,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <Icon size={13} className="text-[#b026ff]" />
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
      {label}
    </span>
    <div className="flex-1 h-px bg-[rgba(176,38,255,0.1)]" />
  </div>
);

const RevenueCard = ({ label, value, accent = false }) => (
  <div
    className={`relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
      accent
        ? "bg-gradient-to-br from-[#1a0d2e] to-[#1a1425] border-[rgba(176,38,255,0.35)] shadow-[0_4px_24px_rgba(176,38,255,0.15)]"
        : "bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border-[rgba(176,38,255,0.12)]"
    }`}
  >
    {accent && (
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none bg-[#b026ff] blur-[50px] opacity-20" />
    )}
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em] mb-2">
      {label}
    </p>
    <p
      className={`text-[1.4rem] font-black leading-none ${accent ? "text-[#dda6ff]" : "text-[#c77dff]"}`}
    >
      {formatVND(value)}
    </p>
  </div>
);

const RoomStatCard = ({ statusKey, count }) => {
  const cfg = ROOM_STATUS[statusKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${cfg.color}22` }}
      >
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] truncate">
          {cfg.label}
        </p>
        <p
          className="text-[1.1rem] font-black leading-tight"
          style={{ color: cfg.color }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

const BookingStatCard = ({ statusKey, count }) => {
  const cfg = BOOKING_STATUS[statusKey];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${cfg.color}22` }}
      >
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] truncate">
          {cfg.label}
        </p>
        <p
          className="text-[1.1rem] font-black leading-tight"
          style={{ color: cfg.color }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

const OccupancyRing = ({ occupied, total, rate }) => {
  const circumference = 2 * Math.PI * 36;
  const filled = (rate / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">
        Tỷ lệ lấp đầy hôm nay
      </p>

      <div className="relative flex items-center justify-center">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="rgba(176,38,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            transform="rotate(-90 44 44)"
          />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b026ff" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-[1.3rem] font-black text-[#dda6ff] leading-none">
            {rate}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-center">
        <div>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Đang ở
          </p>
          <p className="text-sm font-black text-[#60a5fa]">{occupied}</p>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Tổng
          </p>
          <p className="text-sm font-black text-gray-400">{total}</p>
        </div>
      </div>
    </div>
  );
};

const NewBookingsBadge = ({ count }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
    <div>
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] mb-1">
        Booking mới hôm nay
      </p>
      <p className="text-[1.6rem] font-black text-[#dda6ff] leading-none">
        {count}
      </p>
    </div>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,38,255,0.12)] border border-[rgba(176,38,255,0.2)]">
      <Activity size={18} className="text-[#b026ff]" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataSummary = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.summary();
      if (res.success) setSummary(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#b026ff]" size={32} />
      </div>
    );
  }

  if (!summary) return null;

  const { revenue, rooms, bookings, occupancyRate } = summary;

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={13} className="text-[#b026ff]" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
            Tổng quan
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#f5f0ff] tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* ── Doanh thu ── */}
        <section>
          <SectionTitle icon={TrendingUp} label="Doanh thu" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RevenueCard label="Hôm nay" value={revenue.today} />
            <RevenueCard label="Tháng này" value={revenue.thisMonth} />
            <RevenueCard label="Năm nay" value={revenue.thisYear} accent />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Phòng + Booking (left 2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Tình trạng phòng */}
            <section>
              <SectionTitle icon={BedDouble} label="Tình trạng phòng" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(ROOM_STATUS).map((key) => (
                  <RoomStatCard
                    key={key}
                    statusKey={key}
                    count={rooms[key] ?? 0}
                  />
                ))}
              </div>
            </section>

            {/* Booking */}
            <section>
              <SectionTitle icon={CalendarCheck} label="Đặt phòng" />
              <div className="flex flex-col gap-3">
                <NewBookingsBadge count={bookings.newToday} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(BOOKING_STATUS).map((key) => (
                    <BookingStatCard
                      key={key}
                      statusKey={key}
                      count={bookings.byStatus[key] ?? 0}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ── Occupancy (right 1/3) ── */}
          <div className="flex flex-col gap-4">
            <section>
              <SectionTitle icon={Users} label="Lấp đầy" />
              <OccupancyRing
                occupied={occupancyRate.occupied}
                total={occupancyRate.total}
                rate={occupancyRate.rate}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
