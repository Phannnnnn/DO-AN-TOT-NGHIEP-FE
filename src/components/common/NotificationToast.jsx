import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import CancelButton from "./CancelButton";

export const ToastType = {
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
    typeLabel: "Thành công",
    typeLabelColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    glowColor: "bg-red-500",
    topBarGradient: "from-red-600 to-rose-500",
    typeLabel: "Lỗi",
    typeLabelColor: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    glowColor: "bg-amber-500",
    topBarGradient: "from-amber-600 to-yellow-500",
    typeLabel: "Cảnh báo",
    typeLabelColor: "text-amber-500",
  },
  info: {
    icon: Info,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    glowColor: "bg-cyan-500",
    topBarGradient: "from-[#b026ff] to-[#00f0ff]",
    typeLabel: "Thông báo",
    typeLabelColor: "text-cyan-500",
  },
};

const NotificationToast = ({
  isOpen,
  onClose,
  type = "info",
  title = "Thông báo",
  description = "",
  isExiting = false,
}) => {
  if (!isOpen) return null;

  const cfg = TYPE_CONFIGS[type] ?? TYPE_CONFIGS.info;
  const IconComponent = cfg.icon;

  return (
    <div
      className={`relative w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(176,38,255,0.07)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] overflow-hidden pointer-events-auto ${
        isExiting ? "animate-toast-slide-out" : "animate-toast-slide-in"
      }`}
    >
      {/* Top accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cfg.topBarGradient}`}
      />

      {/* Glow blob */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none ${cfg.glowColor} blur-[60px] opacity-10`}
      />

      <div className="absolute top-3 right-3 z-10">
        <CancelButton onClose={onClose} />
      </div>

      <div className="relative p-5 pr-10 flex items-center gap-4">
        {/* Icon */}
        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border ${cfg.iconBg}`}
        >
          <IconComponent size={20} className={cfg.iconColor} />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1 min-w-0">
          <p className={`font-bold ${cfg.typeLabelColor}`}>{title}</p>
          {description && (
            <p className="text-xs text-gray-500 leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
