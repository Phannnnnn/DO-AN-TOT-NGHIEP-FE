import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Timer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = time.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2.5">
      <Clock className="w-3.5 h-3.5 text-[#b026ff]" />
      <span className="text-xs font-semibold tracking-wider font-mono text-[#6b7280]">
        <span className="text-[#9ca3af]">{timeStr}</span>
        <span className="text-white/10 mx-2">|</span>
        {dateStr}
      </span>
    </div>
  );
};

export default Timer;
