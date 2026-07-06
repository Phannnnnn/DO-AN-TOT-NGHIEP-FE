import React from "react";

const Section = ({ title, count, color, children }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-xs font-medium text-zinc-400">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-xs font-medium text-zinc-500">
        <span className="font-mono text-violet-300">{count}</span> phòng
      </span>
    </div>
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
    >
      {children}
    </div>
  </div>
);

export default Section;
