import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Trophy,
  CalendarCheck,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { reportService } from "@/services/report/reportService";

// ── Constants ─────────────────────────────────────────────────────────────────

const GROUP_BY_OPTIONS = [
  { value: "day", label: "Theo ngày" },
  { value: "month", label: "Theo tháng" },
  { value: "year", label: "Theo năm" },
];

const BOOKING_STATUS_CFG = {
  pending: { label: "Chờ xác nhận", icon: Clock, color: "#f59e0b" },
  confirmed: { label: "Đã xác nhận", icon: CalendarCheck, color: "#3b82f6" },
  completed: { label: "Hoàn thành", icon: CheckCircle2, color: "#10b981" },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "#ef4444" },
};

const BREAKDOWN_COLORS = ["#b026ff", "#3b82f6"];

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

// ── Custom tooltip ─────────────────────────────────────────────────────────────

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl border border-[rgba(176,38,255,0.2)] bg-[#160d26] text-xs">
      <p className="text-gray-500 mb-1 font-bold">{label}</p>
      <p className="text-[#dda6ff] font-black">{formatVND(payload[0].value)}</p>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <Icon size={13} className="text-[#b026ff]" />
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
      {label}
    </span>
    <div className="flex-1 h-px bg-[rgba(176,38,255,0.1)]" />
  </div>
);

const FilterPill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-[14px] py-[5px] rounded-[6px] text-[10px] font-black tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border ${
      active
        ? "bg-violet-500/25 text-violet-300 border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
        : "bg-white/[0.04] text-gray-500 border-white/[0.06] hover:bg-white/[0.07] hover:text-gray-400"
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ label, value, sub }) => (
  <div className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)] hover:-translate-y-0.5 transition-all duration-200">
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em] mb-2">
      {label}
    </p>
    <p className="text-[1.4rem] font-black leading-none text-[#dda6ff]">
      {value}
    </p>
    {sub && <p className="text-[10px] text-gray-600 mt-1.5">{sub}</p>}
  </div>
);

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <BarChart3 size={24} className="text-gray-700" />
    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
      Không có dữ liệu
    </p>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

const ReportPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(today());
  const [groupBy, setGroupBy] = useState("day");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.summary({ from, to, groupBy });
      if (res.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [from, to, groupBy]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // ── Derived data ──
  const timeline = data?.revenueTimeline ?? [];
  const breakdown = data?.revenueBreakdown ?? {
    roomRevenue: 0,
    serviceRevenue: 0,
    total: 0,
  };
  const topRooms = data?.topRoomTypes ?? [];
  const byStatus = data?.bookingByStatus ?? {};

  const pieData = [
    { name: "Tiền phòng", value: breakdown.roomRevenue },
    { name: "Dịch vụ", value: breakdown.serviceRevenue },
  ];

  const totalBookings = Object.values(byStatus).reduce((s, v) => s + v, 0);

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      {/* ── Page header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={13} className="text-[#b026ff]" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
            Phân tích
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#f5f0ff] tracking-tight">
          Báo cáo
        </h1>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-8 sticky top-0 z-30 bg-[#0d0d1a]/85 backdrop-blur-[12px] px-5 py-4 rounded-[0.875rem] border border-violet-500/[0.12] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Date range */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Từ ngày
            </label>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/[0.04] border border-[rgba(176,38,255,0.2)] text-[12px] font-semibold text-gray-300 outline-none focus:border-[rgba(176,38,255,0.5)] transition-all cursor-pointer"
            />
          </div>
          <span className="text-gray-700 text-xs mt-4">→</span>
          <div className="flex flex-col gap-0.5">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Đến ngày
            </label>
            <input
              type="date"
              value={to}
              min={from}
              max={today()}
              onChange={(e) => setTo(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/[0.04] border border-[rgba(176,38,255,0.2)] text-[12px] font-semibold text-gray-300 outline-none focus:border-[rgba(176,38,255,0.5)] transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="w-px h-8 bg-white/10 hidden sm:block" />

        {/* Group by */}
        <div className="flex gap-1.5">
          {GROUP_BY_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              active={groupBy === opt.value}
              onClick={() => setGroupBy(opt.value)}
            >
              {opt.label}
            </FilterPill>
          ))}
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[rgba(176,38,255,0.15)] border border-[rgba(176,38,255,0.3)] text-[#dda6ff] text-[10px] font-black uppercase tracking-wider hover:bg-[rgba(176,38,255,0.25)] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Cập nhật
        </button>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#b026ff]" size={32} />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* ── Revenue summary cards ── */}
          <section>
            <SectionTitle icon={TrendingUp} label="Tổng quan doanh thu" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Tổng doanh thu"
                value={formatVND(breakdown.total)}
              />
              <StatCard
                label="Doanh thu phòng"
                value={formatVND(breakdown.roomRevenue)}
                sub={
                  breakdown.total > 0
                    ? `${Math.round((breakdown.roomRevenue / breakdown.total) * 100)}% tổng DT`
                    : "—"
                }
              />
              <StatCard
                label="Doanh thu dịch vụ"
                value={formatVND(breakdown.serviceRevenue)}
                sub={
                  breakdown.total > 0
                    ? `${Math.round((breakdown.serviceRevenue / breakdown.total) * 100)}% tổng DT`
                    : "—"
                }
              />
            </div>
          </section>

          {/* ── Revenue timeline chart ── */}
          <section>
            <SectionTitle icon={TrendingUp} label="Doanh thu theo thời gian" />
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
              <div style={{ height: 240 }}>
                {timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeline}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="lineGrad"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#b026ff" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="period"
                        tick={{
                          fill: "#6b7280",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: "#6b7280",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 1_000_000
                            ? `${(v / 1_000_000).toFixed(1)}M`
                            : v >= 1_000
                              ? `${(v / 1_000).toFixed(0)}K`
                              : v
                        }
                        width={48}
                      />
                      <Tooltip content={<RevenueTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#lineGrad)"
                        strokeWidth={2.5}
                        dot={{ fill: "#b026ff", r: 4, strokeWidth: 0 }}
                        activeDot={{ fill: "#dda6ff", r: 5, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Breakdown pie ── */}
            <section>
              <SectionTitle icon={PieChart} label="Cơ cấu doanh thu" />
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
                <div style={{ height: 220 }}>
                  {breakdown.total > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={BREAKDOWN_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => formatVND(v)}
                          contentStyle={{
                            background: "#160d26",
                            border: "1px solid rgba(176,38,255,0.2)",
                            borderRadius: 12,
                            fontSize: 12,
                            color: "#dda6ff",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(v) => (
                            <span
                              style={{
                                color: "#9ca3af",
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {v}
                            </span>
                          )}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </div>
              </div>
            </section>

            {/* ── Booking by status ── */}
            <section>
              <SectionTitle
                icon={CalendarCheck}
                label="Đặt phòng theo trạng thái"
              />
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
                <div className="flex flex-col gap-2.5">
                  {Object.entries(BOOKING_STATUS_CFG).map(([key, cfg]) => {
                    const count = byStatus[key] ?? 0;
                    const pct =
                      totalBookings > 0 ? (count / totalBookings) * 100 : 0;
                    const Icon = cfg.icon;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <Icon
                          size={13}
                          style={{ color: cfg.color }}
                          className="shrink-0"
                        />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.08em] w-28 shrink-0">
                          {cfg.label}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: cfg.color }}
                          />
                        </div>
                        <span
                          className="text-[11px] font-black w-6 text-right"
                          style={{ color: cfg.color }}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {totalBookings > 0 && (
                  <p className="mt-4 text-[9px] font-black text-gray-700 uppercase tracking-widest text-right">
                    Tổng {totalBookings} booking
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ── Top room types ── */}
          <section>
            <SectionTitle icon={Trophy} label="Top loại phòng" />
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.12)]">
              {topRooms.length > 0 ? (
                <>
                  <div style={{ height: 200 }} className="mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topRooms}
                        margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="barGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#b026ff" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="typeName"
                          tick={{
                            fill: "#6b7280",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fill: "#6b7280",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) =>
                            v >= 1_000_000
                              ? `${(v / 1_000_000).toFixed(1)}M`
                              : `${(v / 1_000).toFixed(0)}K`
                          }
                          width={48}
                        />
                        <Tooltip
                          content={({ active, payload, label }) =>
                            active && payload?.length ? (
                              <div className="px-3 py-2 rounded-xl border border-[rgba(176,38,255,0.2)] bg-[#160d26] text-xs">
                                <p className="text-gray-500 mb-1 font-bold">
                                  {label}
                                </p>
                                <p className="text-[#dda6ff] font-black">
                                  {formatVND(payload[0].value)}
                                </p>
                                <p className="text-gray-600 mt-0.5">
                                  {payload[0].payload.bookingCount} booking
                                </p>
                              </div>
                            ) : null
                          }
                        />
                        <Bar
                          dataKey="revenue"
                          fill="url(#barGrad)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Table */}
                  <div className="border-t border-white/[0.05] pt-4 flex flex-col gap-2">
                    {topRooms.map((rt, i) => (
                      <div
                        key={rt.roomTypeId}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                      >
                        <span className="text-[10px] font-black text-gray-700 w-5 text-center">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-[12px] font-bold text-gray-300">
                          {rt.typeName}
                        </span>
                        <span className="text-[10px] font-black text-gray-600">
                          {rt.bookingCount} booking
                        </span>
                        <span className="text-[12px] font-black text-[#c77dff]">
                          {formatVND(rt.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height: 120 }}>
                  <EmptyChart />
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
