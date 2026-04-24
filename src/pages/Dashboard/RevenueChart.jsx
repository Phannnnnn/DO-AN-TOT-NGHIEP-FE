import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const RevenueChart = () => {
  const data = [
    { day: "T2", revenue: 2400000 },
    { day: "T3", revenue: 3210000 },
    { day: "T4", revenue: 2290000 },
    { day: "T5", revenue: 2290000 },
    { day: "T6", revenue: 2390000 },
    { day: "T7", revenue: 2490000 },
    { day: "CN", revenue: 2100000 },
  ];

  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "tr";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--white)] p-2 rounded border border-[var(--black)]/20 shadow">
          <p className="text-sm font-medium">{payload[0].payload.day}</p>
          <p className="text-sm text-[var(--blue)] font-semibold">
            {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--white)] rounded-lg p-6 shadow-sm border border-[var(--black)]/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--black)]">
          Doanh thu 7 ngày gần đây
        </h3>
        {/* <button className="flex items-center gap-2 text-[var(--blue)] hover:text-[var(--blue_dark)] text-sm font-medium">
          Tuần này
          <ChevronDown className="w-4 h-4" />
        </button> */}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke="var(--black)"
            style={{ fontSize: "12px", fontWeight: "medium" }}
          />
          <YAxis
            stroke="var(--slate)"
            style={{ fontSize: "12px", fontWeight: "medium" }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="revenue" fill="var(--blue)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
