import React from "react";

const FilterPill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-[14px] py-[5px] rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-200 border ${
      active
        ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
        : "bg-[#1a1528]/40 text-zinc-400 border-white/[0.04] hover:bg-[#201a33]/60 hover:text-zinc-200"
    }`}
  >
    {children}
  </button>
);

export default FilterPill;
