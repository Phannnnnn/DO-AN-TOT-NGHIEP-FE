import { useState, useEffect } from "react";
import { Activity, Clock } from "lucide-react";

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
 <Activity size={13} className="text-[#b026ff]" />
 <span className="text-xs font-semibold">
 <span className="">{timeStr}</span>
 <span className="mx-2">|</span>
 {dateStr}
 </span>
 </div>
 );
};

export default Timer;
