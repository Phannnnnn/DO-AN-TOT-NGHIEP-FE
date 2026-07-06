import { formatVND } from "@/types/utils/fomatters/vndFomatter";

export const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-[6px] border border-white/[0.08] bg-[#120d1e]/95 backdrop-blur-md shadow-lg text-xs">
      <p className="text-zinc-500 mb-1 font-medium">{label}</p>
      <p className="text-violet-300 font-semibold font-mono">{formatVND(payload[0].value)}</p>
    </div>
  );
};

export const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-[6px] border border-white/[0.08] bg-[#120d1e]/95 backdrop-blur-md shadow-lg text-xs">
      <p className="text-zinc-500 mb-1 font-medium">{label || payload[0].name}</p>
      <p className="text-violet-300 font-semibold font-mono">
        {formatter ? formatter(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
};
