import { Users, Bed, TrendingUp, CheckCircle, Search } from "lucide-react";
import StatCard from "./StatCard";
import DonutChart from "./DonutChart";
import RevenueChart from "./RevenueChart";
import BookingTable from "./BookingTable";
import RoomCleaningTable from "./RoomCleaningTable";
import { useAuth } from "@/context/ContextProvider";

const statData = [
  {
    label: "Tổng số phòng",
    value: "30",
    icon: Bed,
    iconBgColor: "bg-[var(--blue)]",
  },
  {
    label: "Phòng trống",
    value: "12",
    icon: CheckCircle,
    iconBgColor: "bg-[var(--green)]",
  },
  {
    label: "Dãy có khách",
    value: "15",
    icon: Users,
    iconBgColor: "bg-[var(--red)]",
  },
  {
    label: "Doanh thu",
    value: "1,200,000 VNĐ",
    icon: TrendingUp,
    iconBgColor: "bg-[var(--purple)]",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="p-6">
        <div className="mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statData.map((item, index) => {
              return (
                <StatCard
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  iconBgColor={item.iconBgColor}
                />
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <DonutChart />
            </div>
            <div className="lg:col-span-3">
              <RevenueChart />
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookingTable />
            <RoomCleaningTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
