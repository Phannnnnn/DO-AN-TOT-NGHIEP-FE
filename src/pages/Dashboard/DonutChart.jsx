import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";
import { MoreVertical } from "lucide-react";

const DonutChart = () => {
  const data = [
    { name: "Trống", value: 12, color: "var(--green)" },
    { name: "Đã đặt", value: 10, color: "var(--red)" },
    { name: "Đang dọn", value: 5, color: "var(--yellow)" },
    { name: "Bảo trì", value: 3, color: "var(--slate)" },
  ];

  const totalRooms = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = data.map((item) => item.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--white)] p-2 rounded border border-[var(--black)]/20 shadow">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-[var(--black)]/60">
            {payload[0].value} phòng
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
          Trạng thái phòng
        </h3>
      </div>

      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <Label
                value={`${totalRooms}`}
                position="center"
                fontSize={32}
                fontWeight="bold"
                fill="var(--black)"
                dy={-15}
              />
              <Label
                value="Tổng phòng"
                position="center"
                fontSize={12}
                fill="var(--black)"
                dy={15}
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm font-semibold">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
