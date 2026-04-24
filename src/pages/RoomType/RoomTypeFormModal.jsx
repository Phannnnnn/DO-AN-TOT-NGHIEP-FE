import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import Stepper from "@/components/common/Stepper";

const DEFAULT_FORM = {
  typeName: "",
  description: "",
  maxOccupancy: 1,
};

const RoomTypeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialData?.roomTypeId) {
      setFormData({
        typeName: initialData.typeName ?? "",
        description: initialData.description ?? "",
        maxOccupancy: initialData.maxOccupancy ?? 1,
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setErrors({});
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!formData.typeName.trim())
      e.typeName = "Tên loại phòng không được để trống";
    if (formData.typeName.length > 100) e.typeName = "Tối đa 100 ký tự";
    if (formData.maxOccupancy < 1) e.maxOccupancy = "Sức chứa phải ≥ 1";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      typeName: formData.typeName.trim(),
      description: formData.description.trim() || null,
      maxOccupancy: formData.maxOccupancy,
    });
  };

  const set = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const isEdit = !!initialData?.roomTypeId;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(10px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl"
        style={{ background: "linear-gradient(145deg, #0f0a19, #1a1425)" }}
      >
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {isEdit ? "Cập nhật loại phòng" : "Thêm loại phòng"}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {isEdit
                  ? `Chỉnh sửa thông tin "${initialData.typeName}"`
                  : "Điền thông tin cơ bản để tạo loại phòng mới"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-600 hover:bg-white/10 hover:text-gray-300 transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Tên loại phòng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Tên loại phòng
            </label>
            <input
              type="text"
              value={formData.typeName}
              onChange={(e) => set("typeName", e.target.value)}
              placeholder="VD: Standard, Deluxe, Suite..."
              maxLength={100}
              className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border
                ${
                  errors.typeName
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.08)]"
                }`}
            />
            {errors.typeName && (
              <span className="text-[10px] text-red-400">
                {errors.typeName}
              </span>
            )}
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Mô tả{" "}
              <span className="text-gray-700 normal-case tracking-normal font-medium">
                (tuỳ chọn)
              </span>
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Mô tả ngắn về loại phòng..."
              rows={3}
              className="px-3.5 py-3 rounded-lg bg-white/[0.04] text-[13px] font-medium text-gray-200 outline-none resize-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.08)] placeholder:text-gray-700"
            />
          </div>

          {/* Sức chứa */}
          <div className="w-40">
            <Stepper
              label="Sức chứa tối đa"
              value={formData.maxOccupancy}
              onChange={(v) => set("maxOccupancy", v)}
              min={1}
            />
            {errors.maxOccupancy && (
              <span className="text-[10px] text-red-400 mt-1 block">
                {errors.maxOccupancy}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: "linear-gradient(135deg, #b026ff, #7c3aed)",
                boxShadow: "0 4px 16px rgba(176,38,255,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(176,38,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(176,38,255,0.35)";
              }}
            >
              <Save size={14} />
              {isEdit ? "Cập nhật" : "Tạo loại phòng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeFormModal;
