import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const BedTypeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [roomBedType, setRoomBedType] = useState("");
  const [error, setError] = useState("");

  const isEdit = !!initialData?.roomBedId;

  useEffect(() => {
    if (!isOpen) return;
    setRoomBedType(initialData?.roomBedType ?? "");
    setError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!roomBedType.trim()) {
      setError("Tên loại giường không được để trống");
      return;
    }
    if (roomBedType.length > 50) {
      setError("Tối đa 50 ký tự");
      return;
    }
    onSubmit({ roomBedType: roomBedType.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425]">
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {isEdit ? "Cập nhật loại giường" : "Thêm loại giường"}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {isEdit ? `Chỉnh sửa "${initialData.roomBedType}"` : "Nhập tên loại giường mới"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-600 hover:bg-white/10 hover:text-gray-300 transition-colors cursor-pointer shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Tên loại giường <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roomBedType}
              onChange={(e) => { setRoomBedType(e.target.value); setError(""); }}
              placeholder="VD: single, king, queen..."
              maxLength={50}
              autoFocus
              className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border ${
                error
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {error && <span className="text-[10px] text-red-400">{error}</span>}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
            >
              <Save size={14} />
              {isEdit ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedTypeFormModal;
