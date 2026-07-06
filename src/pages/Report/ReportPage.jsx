import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp,
  PieChart,
  Trophy,
  CalendarCheck,
  XCircle,
  Target,
  Wrench,
  Users,
  Globe2,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
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

import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";
import EmptyChart from "./EmptyChart";
import TabButton from "./TabButton";
import { RevenueTooltip, CustomTooltip } from "./ReportTooltips";
import LoadingSection from "@/components/common/LoadingSection";
import DateRangePicker from "@/components/common/DateRangePicker";
import RefreshButton from "@/components/common/RefreshButton";
import ExportButton from "@/components/common/ExportButton";
import { useSidebar } from "@/components/ui/sidebar";

// ── Constants ─────────────────────────────────────────────────────────────────

const GROUP_BY_OPTIONS = [
  { value: "month", label: "Theo tháng" },
  { value: "quarter", label: "Theo quý" },
  { value: "year", label: "Theo năm" },
];

const BOOKING_STATUS_CFG = {
  pending: { label: "Chờ xác nhận", icon: Clock, color: "#3b82f6" },
  confirmed: { label: "Đã xác nhận", icon: CalendarCheck, color: "#7c3aed" },
  completed: { label: "Hoàn thành", icon: CheckCircle2, color: "#ec4899" },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "#ef4444" },
};

const BREAKDOWN_COLORS = [
  "#7c3aed",
  "#ec4899",
  "#3b82f6",
  "#b026ff",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#a78bfa",
];

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

// ── Main Page ──────────────────────────────────────────────────────────────────

const ReportPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(today());
  const [groupBy, setGroupBy] = useState("month");
  const [activeTab, setActiveTab] = useState("finance");

  const { open, setOpenMobile, isMobile } = useSidebar();

  console.log(open);

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

  const formatDateVN = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleExportCSV = () => {
    if (!data) return;

    let csvContent = "\uFEFF"; // Keep only UTF-8 BOM so Excel respects the encoding
    let fileName = `Bao_cao_hotel_${from}_to_${to}.csv`;

    if (activeTab === "finance") {
      fileName = `Bao_cao_Tai_chinh_${from}_to_${to}.csv`;
      csvContent += "BÁO CÁO TÀI CHÍNH KHÁCH SẠN\r\n";
      csvContent += `Thời gian:,Từ ${formatDateVN(from)} đến ${formatDateVN(to)}\r\n\r\n`;

      csvContent += "CHỈ SỐ TÀI CHÍNH CHÍNH\r\n";
      csvContent += "STT,Chỉ số,Giá trị (VND)\r\n";
      csvContent += `1,Tổng doanh thu,${breakdown.total}\r\n`;
      csvContent += `2,Doanh thu phòng,${breakdown.roomRevenue}\r\n`;
      csvContent += `3,Doanh thu dịch vụ,${breakdown.serviceRevenue}\r\n\r\n`;

      csvContent += "CHI TIẾT DOANH THU THEO THỜI GIAN\r\n";
      csvContent += "STT,Giai đoạn,Doanh thu (VND)\r\n";
      timeline.forEach((item, index) => {
        csvContent += `${index + 1},${item.period},${item.revenue}\r\n`;
      });
    } else if (activeTab === "strategy") {
      fileName = `Bao_cao_Khach_hang_${from}_to_${to}.csv`;
      csvContent += "BÁO CÁO CHIẾN LƯỢC VÀ KHÁCH HÀNG\r\n";
      csvContent += `Thời gian:,Từ ${formatDateVN(from)} đến ${formatDateVN(to)}\r\n\r\n`;

      csvContent += "HIỆU SUẤT LOẠI PHÒNG\r\n";
      csvContent += "STT,Loại phòng,Số lượt đặt,Doanh thu (VND)\r\n";
      topRooms.forEach((item, index) => {
        csvContent += `${index + 1},${item.typeName},${item.bookingCount},${item.revenue}\r\n`;
      });
      csvContent += "\r\n";

      csvContent += "PHÂN KHÚC QUỐC TỊCH\r\n";
      csvContent += "STT,Quốc tịch,Số lượng khách\r\n";
      customerNationality.forEach((item, index) => {
        csvContent += `${index + 1},${item.nationality},${item.count}\r\n`;
      });
      csvContent += "\r\n";

      csvContent += "TOP 10 KHÁCH HÀNG VIP\r\n";
      csvContent +=
        "STT,Họ tên,Số điện thoại,Email,Số lượt đặt,Tổng chi tiêu (VND)\r\n";
      topCustomers.forEach((item, index) => {
        const phoneCell = item.phone ? `="${item.phone}"` : "-";
        csvContent += `${index + 1},${item.fullName},${phoneCell},${item.email || "-"},${item.bookingCount},${item.totalSpent}\r\n`;
      });
    } else if (activeTab === "operations") {
      fileName = `Bao_cao_Van_hanh_${from}_to_${to}.csv`;
      csvContent += "BÁO CÁO VẬN HÀNH VÀ BUỒNG PHÒNG\r\n";
      csvContent += `Thời gian:,Từ ${formatDateVN(from)} đến ${formatDateVN(to)}\r\n\r\n`;

      csvContent += "TRẠNG THÁI ĐẶT PHÒNG\r\n";
      csvContent += "STT,Trạng thái,Số lượng\r\n";
      Object.entries(BOOKING_STATUS_CFG).forEach(([key, cfg], index) => {
        csvContent += `${index + 1},${cfg.label},${byStatus[key] ?? 0}\r\n`;
      });
      csvContent += "\r\n";

      csvContent += "HIỆU SUẤT VẬN HÀNH\r\n";
      csvContent += "STT,Chỉ số,Giá trị\r\n";
      csvContent += `1,Tổng đơn bị hủy,${cancellations}\r\n`;
      csvContent += `2,Thời gian dọn dẹp trung bình (phút),${housekeepingPerformance.avgCompletionTimeMinutes ?? "N/A"}\r\n`;
      csvContent += `3,Nhiệm vụ buồng phòng hoàn thành,${housekeepingPerformance.totalCompleted ?? 0}\r\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Derived data ──
  const timeline = data?.revenueTimeline ?? [];
  const breakdown = data?.revenueBreakdown ?? {
    roomRevenue: 0,
    serviceRevenue: 0,
    total: 0,
    adr: 0,
  };
  const topRooms = data?.topRoomTypes ?? [];
  const byStatus = data?.bookingByStatus ?? {};
  const cancellations = data?.cancellations ?? 0;
  const occupancyTrend = data?.occupancyTrend ?? { weekday: 0, weekend: 0 };
  const customerNationality = data?.customerNationality ?? [];
  const housekeepingPerformance = data?.housekeepingPerformance ?? {
    avgCompletionTimeMinutes: 0,
    totalCompleted: 0,
  };
  const topCustomers = data?.topCustomers ?? [];

  const pieData = [
    { name: "Tiền phòng", value: breakdown.roomRevenue },
    { name: "Dịch vụ", value: breakdown.serviceRevenue },
  ];

  const occupancyPieData = [
    { name: "Ngày thường (T2-T6)", value: occupancyTrend.weekday },
    { name: "Cuối tuần (T7-CN)", value: occupancyTrend.weekend },
  ];

  const totalBookings = Object.values(byStatus).reduce((s, v) => s + v, 0);

  return (
    <div className="p-4 sm:p-8">
      {/* ── Filters ── */}
      <div
        className={`${open ? "md:flex-col" : "md:flex-row md:justify-between"} flex flex-col gap-4 lg:flex-row lg:justify-between mb-6 sticky top-0 z-30 bg-[#120d1e]/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]`}
      >
        {/* Date range */}
        <DateRangePicker
          checkInDate={from}
          checkOutDate={to}
          onChangeCheckIn={setFrom}
          onChangeCheckOut={setTo}
          minCheckInDate={null}
          maxCheckInDate={to}
          minCheckOutDate={from}
          maxCheckOutDate={today()}
          variant="inline"
          labelFrom="Từ ngày"
          labelTo="Đến ngày"
          required={false}
          allowSameDay={true}
        />

        <div
          className={`${open ? "md:flex-row" : "md:flex-col"} flex gap-3 lg:flex-col justify-between`}
        >
          <RefreshButton
            label={"Cập nhật"}
            onClick={fetchReport}
            disabled={loading}
          />

          <ExportButton
            label="Xuất báo cáo"
            onClick={handleExportCSV}
            disabled={loading || !data}
          />
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div
        className={`${open ? "" : "md:flex-row"} flex flex-col lg:flex-row whitespace-nowrap scrollbar-none border-b border-white/[0.05] mb-8 pb-1 w-full max-w-full`}
      >
        <TabButton
          active={activeTab === "finance"}
          onClick={() => setActiveTab("finance")}
          icon={TrendingUp}
          label="Quản lý & Tài chính"
        />
        <TabButton
          active={activeTab === "strategy"}
          onClick={() => setActiveTab("strategy")}
          icon={Target}
          label="Chiến lược & Khách hàng"
        />
        <TabButton
          active={activeTab === "operations"}
          onClick={() => setActiveTab("operations")}
          icon={Wrench}
          label="Vận hành & Hủy phòng"
        />
      </div>

      {loading && !data ? (
        <LoadingSection />
      ) : (
        <div className="flex flex-col gap-8">
          {/* =========================================================
 TAB 1: TÀI CHÍNH
 ========================================================= */}
          {activeTab === "finance" && (
            <>
              {/* ── Revenue summary cards ── */}
              <section>
                <SectionTitle icon={TrendingUp} label="KPI Tài chính" />
                <div className="flex flex-col md:flex-row md:justify-center gap-4">
                  <StatCard
                    label="Tổng doanh thu"
                    value={formatVND(breakdown.total)}
                  />
                  <StatCard
                    label="Doanh thu phòng"
                    value={formatVND(breakdown.roomRevenue)}
                    sub={
                      breakdown.total > 0
                        ? `${Math.round((breakdown.roomRevenue / breakdown.total) * 100)}% tổng doanh thu`
                        : ""
                    }
                  />
                  <StatCard
                    label="Doanh thu dịch vụ"
                    value={formatVND(breakdown.serviceRevenue)}
                    sub={
                      breakdown.total > 0
                        ? `${Math.round((breakdown.serviceRevenue / breakdown.total) * 100)}% tổng doanh thu`
                        : ""
                    }
                  />
                </div>
              </section>

              <section>
                <div className="flex justify-between items-start sm:items-center mb-4 flex-wrap gap-3">
                  <SectionTitle
                    icon={TrendingUp}
                    label="Doanh thu theo thời gian"
                  />
                  <div className="flex gap-1 bg-[#1a1528]/40 p-0.5 border border-white/[0.04] rounded-[6px]">
                    {GROUP_BY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGroupBy(opt.value)}
                        className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all duration-200 cursor-pointer ${
                          groupBy === opt.value
                            ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                            : "text-[#9ca3af] hover:text-[#dda6ff] border border-transparent"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div style={{ height: 240 }}>
                    {timeline.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={timeline}
                          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="barTimeGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#b026ff" />
                              <stop
                                offset="100%"
                                stopColor="#7c3aed"
                                stopOpacity={0.6}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="period"
                            tick={{
                              fill: "#9ca3af",
                              fontSize: 10,
                              fontWeight: 500,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{
                              fill: "#9ca3af",
                              fontSize: 10,
                              fontWeight: 500,
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
                          <Bar
                            dataKey="revenue"
                            fill="url(#barTimeGrad)"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
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
                  <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
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
                                background: "#120d1e",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: 6,
                                fontSize: 12,
                                color: "#a78bfa",
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
                                    fontWeight: 500,
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

                {/* ── Occupancy Trend ── */}
                <section>
                  <SectionTitle
                    icon={PieChart}
                    label="Xu hướng lấp đầy (Số đêm)"
                  />
                  <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                    <div style={{ height: 220 }}>
                      {occupancyTrend.weekday > 0 ||
                      occupancyTrend.weekend > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={occupancyPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              <Cell fill="#eab308" />
                              <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip
                              content={
                                <CustomTooltip
                                  formatter={(v) => `${v} đêm phòng`}
                                />
                              }
                            />
                            <Legend
                              iconType="circle"
                              iconSize={8}
                              formatter={(v) => (
                                <span
                                  style={{
                                    color: "#9ca3af",
                                    fontSize: 11,
                                    fontWeight: 500,
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
              </div>
            </>
          )}

          {/* =========================================================
 TAB 2: CHIẾN LƯỢC & KHÁCH HÀNG
 ========================================================= */}
          {activeTab === "strategy" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Nationality ── */}
                <section>
                  <SectionTitle icon={Globe2} label="Phân khúc quốc tịch" />
                  <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] h-[260px] sm:h-[320px]">
                    {customerNationality.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={customerNationality}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="count"
                            nameKey="nationality"
                            label={({
                              cx,
                              cy,
                              midAngle,
                              innerRadius,
                              outerRadius,
                              value,
                              index,
                            }) => {
                              const RADIAN = Math.PI / 180;
                              const radius =
                                25 + innerRadius + (outerRadius - innerRadius);
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="#9ca3af"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  fontSize={10}
                                  fontWeight={500}
                                >
                                  {customerNationality[index].nationality} (
                                  {value})
                                </text>
                              );
                            }}
                          >
                            {customerNationality.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  BREAKDOWN_COLORS[
                                    index % BREAKDOWN_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={
                              <CustomTooltip formatter={(v) => `${v} khách`} />
                            }
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart />
                    )}
                  </div>
                </section>

                {/* ── VIP Customers ── */}
                <section>
                  <SectionTitle icon={Users} label="Top khách hàng VIP" />
                  <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] h-[260px] sm:h-[320px] overflow-y-auto custom-scrollbar">
                    {topCustomers.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {topCustomers.map((cust, i) => (
                          <div
                            key={cust.customerId}
                            className="flex justify-between items-center px-3 py-2 bg-[#1a1528]/20 border border-white/[0.04] rounded-[6px] hover:bg-[#1a1528]/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/10 text-violet-300 text-[10px] font-mono font-medium">
                                {i + 1}
                              </span>
                              <div>
                                <p className="text-xs font-medium text-zinc-200">
                                  {cust.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {cust.phone || cust.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium font-mono text-emerald-400">
                                {formatVND(cust.totalSpent)}
                              </p>
                              <p className="text-xs text-zinc-500 font-mono font-medium">
                                {cust.bookingCount} lượt
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyChart />
                    )}
                  </div>
                </section>
              </div>

              {/* ── Top room types ── */}
              <section>
                <SectionTitle icon={Trophy} label="Hiệu suất loại phòng" />
                <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  {topRooms.length > 0 ? (
                    <>
                      <div style={{ height: 200 }} className="mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={topRooms}
                            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
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
                                fill: "#9ca3af",
                                fontSize: 10,
                                fontWeight: 500,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{
                                fill: "#9ca3af",
                                fontSize: 10,
                                fontWeight: 500,
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
                                  <div className="px-3 py-2 rounded-[6px] border border-white/[0.08] bg-[#120d1e]/95 text-xs">
                                    <p className="text-zinc-500 mb-1 font-medium">
                                      {label}
                                    </p>
                                    <p className="text-violet-300 font-mono font-medium">
                                      {formatVND(payload[0].value)}
                                    </p>
                                    <p className="mt-0.5 text-zinc-400 text-[11px] font-mono">
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
                            className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/[0.01] transition-colors"
                          >
                            <span className="text-xs font-mono font-medium text-zinc-500 w-5 text-center">
                              {i + 1}
                            </span>
                            <span className="flex-1 text-xs font-medium text-zinc-300">
                              {rt.typeName}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">
                              {rt.bookingCount} booking
                            </span>
                            <span className="text-xs font-mono font-medium text-violet-300">
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
            </>
          )}

          {/* =========================================================
 TAB 3: VẬN HÀNH & HỦY PHÒNG
 ========================================================= */}
          {activeTab === "operations" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── Booking by status ── */}
                <section>
                  <SectionTitle
                    icon={CalendarCheck}
                    label="Đặt phòng theo trạng thái"
                  />
                  <div className="p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                    <div className="flex flex-col gap-3">
                      {Object.entries(BOOKING_STATUS_CFG).map(([key, cfg]) => {
                        const count = byStatus[key] ?? 0;
                        const pct =
                          totalBookings > 0 ? (count / totalBookings) * 100 : 0;
                        const Icon = cfg.icon;
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <Icon
                              size={14}
                              style={{ color: cfg.color }}
                              className="shrink-0"
                            />
                            <span className="text-xs font-medium text-zinc-400 w-28 shrink-0">
                              {cfg.label}
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-white/[0.03] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background: cfg.color,
                                }}
                              />
                            </div>
                            <span
                              className="text-sm font-mono font-medium w-8 text-right"
                              style={{ color: cfg.color }}
                            >
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {totalBookings > 0 && (
                      <p className="mt-6 pt-4 border-t border-white/[0.05] text-xs font-medium text-zinc-400 text-right">
                        Tổng cộng{" "}
                        <span className="font-mono text-violet-300">
                          {totalBookings}
                        </span>{" "}
                        đơn đặt phòng
                      </p>
                    )}
                  </div>
                </section>

                <div className="flex flex-col gap-4">
                  <section>
                    <SectionTitle icon={XCircle} label="Tỷ lệ hủy phòng" />
                    <StatCard
                      label="Số lượng đơn bị hủy"
                      value={cancellations}
                      sub={
                        totalBookings > 0
                          ? `Chiếm ${((cancellations / totalBookings) * 100).toFixed(1)}% tổng số đơn`
                          : ""
                      }
                    />
                  </section>

                  <section>
                    <SectionTitle
                      icon={Sparkles}
                      label="Hiệu suất Buồng phòng"
                    />
                    <StatCard
                      label="Thời gian dọn dẹp trung bình"
                      value={
                        housekeepingPerformance.avgCompletionTimeMinutes
                          ? `${housekeepingPerformance.avgCompletionTimeMinutes} phút`
                          : "N/A"
                      }
                      sub={`Dựa trên ${housekeepingPerformance.totalCompleted} nhiệm vụ đã hoàn thành`}
                    />
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
