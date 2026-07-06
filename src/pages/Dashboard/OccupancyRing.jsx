import React from "react";

const OccupancyRing = ({ occupied, total, rate }) => {
  const circumference = 2 * Math.PI * 36;
  const filled = (rate / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] h-full">
      <p className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Tỷ lệ lấp đầy hôm nay</p>

      <div className="relative flex items-center justify-center">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="5"
          />
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            transform="rotate(-90 44 44)"
          />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-base font-semibold font-mono text-violet-300 leading-none">
            {rate}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-center mt-1">
        <div>
          <p className="text-[10px] font-medium text-zinc-500 mb-0.5">Đang ở</p>
          <p className="text-sm font-semibold font-mono text-blue-400">{occupied}</p>
        </div>
        <div className="w-px h-6 bg-white/[0.06]" />
        <div>
          <p className="text-[10px] font-medium text-zinc-500 mb-0.5 truncate">Tổng số phòng</p>
          <p className="text-sm font-semibold font-mono text-amber-400">{total}</p>
        </div>
      </div>
    </div>
  );
};

export default OccupancyRing;
