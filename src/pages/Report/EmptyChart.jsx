import React from "react";
import { BarChart3 } from "lucide-react";

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <BarChart3 size={24} className="text-zinc-600" />
    <p className="text-xs font-medium text-zinc-500">Không có dữ liệu</p>
  </div>
);

export default EmptyChart;
