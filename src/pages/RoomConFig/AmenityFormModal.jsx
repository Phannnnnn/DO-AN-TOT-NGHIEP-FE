import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";

const CATEGORY_OPTIONS = [
  { value: "bathroom", label: "Phòng tắm" },
  { value: "bedroom", label: "Phòng ngủ" },
  { value: "entertainment", label: "Giải trí" },
  { value: "service", label: "Dịch vụ" },
  { value: "view", label: "Tầm nhìn" },
  { value: "other", label: "Khác" },
];

const DEFAULT_FORM = { roomAmenityName: "", category: "bathroom" };

const AmenityFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData?.roomAmenityId;

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setFormData(
      isEdit
        ? {
            roomAmenityName: initialData.roomAmenityName ?? "",
            category: initialData.category ?? "bathroom",
          }
        : DEFAULT_FORM,
    );
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const set = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = () => {
    const e = {};
    if (!formData.roomAmenityName.trim())
      e.roomAmenityName = "Tên tiện ích không được để trống";
    if (formData.roomAmenityName.length > 100)
      e.roomAmenityName = "Tối đa 100 ký tự";
    if (!formData.category) e.category = "Chọn danh mục";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      roomAmenityName: formData.roomAmenityName.trim(),
      category: formData.category,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425]">
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {isEdit ? "Cập nhật tiện ích" : "Thêm tiện ích"}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {isEdit
                  ? `Chỉnh sửa "${initialData.roomAmenityName}"`
                  : "Nhập thông tin tiện ích mới"}
              </p>
            </div>
            <CancelButton onClose={onClose} />
          </div>

          {/* Tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Tên tiện ích <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.roomAmenityName}
              onChange={(e) => set("roomAmenityName", e.target.value)}
              placeholder="VD: Bồn tắm, Máy lạnh..."
              maxLength={100}
              autoFocus
              className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border ${
                errors.roomAmenityName
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {errors.roomAmenityName && (
              <span className="text-[10px] text-red-400">
                {errors.roomAmenityName}
              </span>
            )}
          </div>

          {/* Danh mục */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("category", opt.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border ${
                    formData.category === opt.value
                      ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.4)] text-[#dda6ff]"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <span className="text-[10px] text-red-400">
                {errors.category}
              </span>
            )}
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

export default AmenityFormModal;
