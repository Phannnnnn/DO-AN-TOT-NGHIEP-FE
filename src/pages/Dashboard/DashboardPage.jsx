import { useEffect, useState } from "react";
import {
  TrendingUp,
  BedDouble,
  CalendarCheck,
  LogIn,
  LogOut,
  Wrench,
  DollarSign,
  CalendarRange,
  CalendarDays,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard/dashboardService";

import SectionTitle from "./SectionTitle";
import RevenueCard from "./RevenueCard";
import OperationsBadge from "./OperationsBadge";
import RoomStatCard, { ROOM_STATUS } from "./RoomStatCard";
import BookingStatCard, { BOOKING_STATUS } from "./BookingStatCard";
import OccupancyRing from "./OccupancyRing";
import LoadingSection from "@/components/common/LoadingSection";

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
    return <LoadingSection />;
  }

  if (!summary) return null;

  const { revenue, rooms, bookings, occupancyRate, operations } = summary;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#120d1e]/95 backdrop-blur-md px-5 py-4 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] mb-6">
        <div>
          <h2 className="text-base font-medium text-zinc-100">Tổng quan hoạt động</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Thống kê dữ liệu hoạt động & doanh thu thời gian thực</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* ── Doanh thu ── */}
        <section>
          <SectionTitle icon={TrendingUp} label="Doanh thu nhanh" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RevenueCard
              label="Hôm nay"
              value={revenue.today}
              icon={DollarSign}
              iconColor="text-blue-400"
              colorClass="from-[#1e3a5f]/25 to-[#121f3d]/15"
              borderColor="border-blue-500/10"
            />
            <RevenueCard
              label="Tuần này"
              value={revenue.thisWeek}
              icon={CalendarRange}
              iconColor="text-emerald-400"
              colorClass="from-[#1b4332]/25 to-[#081c15]/15"
              borderColor="border-emerald-500/10"
            />
            <RevenueCard
              label="Tháng này"
              value={revenue.thisMonth}
              icon={CalendarDays}
              iconColor="text-amber-400"
              colorClass="from-[#472c0c]/25 to-[#2c1b04]/15"
              borderColor="border-amber-500/10"
            />
            <RevenueCard
              label="Năm nay"
              value={revenue.thisYear}
              icon={TrendingUp}
              iconColor="text-pink-400"
              colorClass="from-[#4a0e2e]/25 to-[#2a081a]/15"
              borderColor="border-pink-500/10"
              accent
            />
          </div>
        </section>

        {/* ── Arrival & Departures (Operations) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OperationsBadge
            label="Khách nhận phòng"
            count={operations?.arrivalsToday || 0}
            icon={LogIn}
            color="#10b981"
            accent
          />
          <OperationsBadge
            label="Khách trả phòng"
            count={operations?.departuresToday || 0}
            icon={LogOut}
            color="#eab308"
            accent
          />
          <OperationsBadge
            label="Đơn đặt phòng mới"
            count={bookings.newToday}
            icon={CalendarCheck}
            color="#3b82f6"
          />
          <OperationsBadge
            label="Phòng đang dọn/bảo trì"
            count={(rooms.cleaning || 0) + (rooms.maintenance || 0)}
            icon={Wrench}
            color="#ef4444"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* ── Tình trạng phòng + Booking (left 2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Tình trạng phòng */}
            <section>
              <SectionTitle icon={BedDouble} label="Tình trạng phòng thực tế" />
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
              <SectionTitle icon={CalendarCheck} label="Trạng thái đặt phòng" />
              <div className="flex flex-col gap-3">
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

          {/* ── Lấp đầy (right 1/3) ── */}
          <div className="flex flex-col gap-4">
            <section className="h-full pt-10">
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
