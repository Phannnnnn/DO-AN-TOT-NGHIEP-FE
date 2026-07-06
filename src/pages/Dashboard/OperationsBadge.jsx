import React from "react";

const OperationsBadge = ({ label, count, icon: Icon, color, accent }) => (
  <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200">
    <div>
      <p className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 mb-2">{label}</p>
      <p
        className="text-xl font-semibold font-mono leading-none"
        style={{ color: accent ? color : "#f8fafc" }}
      >
        {count}
      </p>
    </div>
    <div
      className="w-9 h-9 rounded-[6px] flex items-center justify-center border"
      style={{ backgroundColor: `${color}10`, borderColor: `${color}25` }}
    >
      <Icon size={16} style={{ color }} />
    </div>
  </div>
);

export default OperationsBadge;
