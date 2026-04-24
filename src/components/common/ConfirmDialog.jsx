import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?",
  confirmLabel = "Xóa",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(10px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0f0a19, #1a1425)" }}
      >
        {/* Top red accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-rose-500" />

        <div className="p-6 flex flex-col gap-5">
          {/* Icon + close */}
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-600 hover:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Text */}
          <div className="flex flex-col text-center gap-1.5">
            <h3 className="text-base font-black text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-[2] h-10 rounded-xl text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 transition-all shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)]"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
