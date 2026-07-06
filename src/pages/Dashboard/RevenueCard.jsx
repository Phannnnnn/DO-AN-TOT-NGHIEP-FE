import React from "react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

const RevenueCard = ({
  label,
  value,
  icon: Icon,
  colorClass = "from-[#120d1e]/80 to-[#1a1528]/80",
  iconColor = "text-violet-400",
  borderColor = "border-white/[0.06]",
  accent = false,
}) => (
  <div
    className={`relative overflow-hidden flex items-center justify-between p-5 rounded-[8px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.55)] bg-gradient-to-br shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${colorClass} ${borderColor}`}
  >
    {accent && (
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none bg-violet-500 blur-[40px] opacity-15" />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 mb-2">{label}</p>
      <p
        className={`text-lg font-semibold font-mono leading-none ${accent ? "text-violet-300" : "text-zinc-100"}`}
      >
        {formatVND(value)}
      </p>
    </div>
    {Icon && (
      <div
        className={`w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 ml-4 bg-white/[0.02] border border-white/[0.04] ${iconColor}`}
      >
        <Icon size={18} />
      </div>
    )}
  </div>
);

export default RevenueCard;
