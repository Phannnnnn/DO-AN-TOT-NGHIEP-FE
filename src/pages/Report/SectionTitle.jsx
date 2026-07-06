import React from "react";

const SectionTitle = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <Icon size={13} className="text-violet-400" />
    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
      {label}
    </span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);

export default SectionTitle;
