import { Trash2 } from "lucide-react";
import CancelButton from "./CancelButton";

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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.82)] backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(176,38,255,0.07)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-rose-500" />

        {/* Glow blob */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none bg-red-500 blur-[60px] opacity-10" />

        <div className="absolute top-4 right-4 z-10">
          <CancelButton onClose={onClose} />
        </div>

        <div className="relative p-8 flex flex-col items-center gap-5">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
            <Trash2 size={28} className="text-red-400" />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
              Xác nhận
            </p>
            <h3 className="text-xl font-black text-[#f5f0ff] tracking-tight">
              {title}
            </h3>
            <p className="text-[12px] text-gray-500 leading-relaxed max-w-[260px]">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)] transition-all cursor-pointer"
            >
              <Trash2 size={13} />
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
