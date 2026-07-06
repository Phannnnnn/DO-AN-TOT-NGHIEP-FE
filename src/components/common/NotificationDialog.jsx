import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import CancelButton from "./CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";

export const DialogType = {
 SUCCESS: "success",
 ERROR: "error",
 WARNING: "warning",
 INFO: "info",
};

const TYPE_CONFIGS = {
 success: {
 icon: CheckCircle2,
 iconColor: "text-emerald-400",
 iconBg: "bg-emerald-500/10 border-emerald-500/20",
 glowColor: "bg-emerald-500",
 topBarGradient: "from-emerald-600 to-teal-500",
 buttonGradient:
 "from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)]",
 typeLabel: "Thành công",
 typeLabelColor: "text-emerald-500",
 },
 error: {
 icon: XCircle,
 iconColor: "text-red-400",
 iconBg: "bg-red-500/10 border-red-500/20",
 glowColor: "bg-red-500",
 topBarGradient: "from-red-600 to-rose-500",
 buttonGradient:
 "from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)]",
 typeLabel: "Thất bại / Lỗi",
 typeLabelColor: "text-red-500",
 },
 warning: {
 icon: AlertCircle,
 iconColor: "text-amber-400",
 iconBg: "bg-amber-500/10 border-amber-500/20",
 glowColor: "bg-amber-500",
 topBarGradient: "from-amber-600 to-yellow-500",
 buttonGradient:
 "from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)]",
 typeLabel: "Cảnh báo",
 typeLabelColor: "text-amber-500",
 },
 info: {
 icon: Info,
 iconColor: "text-cyan-400",
 iconBg: "bg-cyan-500/10 border-cyan-500/20",
 glowColor: "bg-cyan-500",
 topBarGradient: "from-[#b026ff] to-[#00f0ff]",
 buttonGradient:
 "from-[#b026ff] to-[#00f0ff] hover:from-[#c77dff] hover:to-[#5ce1e6] shadow-[0_4px_16px_rgba(0,240,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,240,255,0.45)]",
 typeLabel: "Thông báo",
 typeLabelColor: "text-cyan-500",
 },
};

const NotificationDialog = ({
 isOpen,
 onClose,
 type = "info",
 title = "Thông báo",
 description = "",
 confirmLabel = "Xác nhận",
 onConfirm,
}) => {
 useNoScroll(isOpen);
 if (!isOpen) return null;

 const cfg = TYPE_CONFIGS[type] ?? TYPE_CONFIGS.info;
 const IconComponent = cfg.icon;

 const handleConfirm = () => {
 if (onConfirm) {
 onConfirm();
 }
 onClose();
 };

 return (
 <div
 className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.2)] backdrop-blur-[2px] animate-fade-in"
 onClick={(e) => {
 if (e.target === e.currentTarget) onClose();
 }}
 >
 <div className="relative w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(176,38,255,0.07)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] overflow-hidden">
 {/* Top accent */}
 <div
 className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cfg.topBarGradient}`}
 />

 {/* Glow blob */}
 <div
 className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none ${cfg.glowColor} blur-[60px] opacity-10`}
 />

 <div className="absolute top-4 right-4 z-10">
 <CancelButton onClose={onClose} />
 </div>

 <div className="relative p-8 flex flex-col items-center gap-5">
 {/* Icon */}
 <div
 className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${cfg.iconBg}`}
 >
 <IconComponent size={28} className={cfg.iconColor} />
 </div>

 {/* Text */}
 <div className="flex flex-col items-center text-center gap-2">
 <p
 className={`text-xs font-bold ${cfg.typeLabelColor}`}
 >
 {cfg.typeLabel}
 </p>
 <h3 className="text-xl font-bold text-[#f5f0ff]">
 {title}
 </h3>
 {description && (
 <p className="text-xs text-gray-500 leading-relaxed max-w-[260px]">
 {description}
 </p>
 )}
 </div>

 {/* Action button */}
 <button
 onClick={handleConfirm}
 className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.buttonGradient} transition-all cursor-pointer`}
 >
 {confirmLabel}
 </button>
 </div>
 </div>
 </div>
 );
};

export default NotificationDialog;
