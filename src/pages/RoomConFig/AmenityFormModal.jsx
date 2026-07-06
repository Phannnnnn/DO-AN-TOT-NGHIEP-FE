import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";
import SaveButton from "@/components/common/SaveButton";
import CloseButton from "@/components/common/CloseButton";

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
 useNoScroll(isOpen);
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md">
        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-medium text-zinc-100">
                {isEdit ? "Cập nhật tiện ích" : "Thêm tiện ích"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {isEdit
                  ? `Chỉnh sửa "${initialData.roomAmenityName}"`
                  : "Nhập thông tin tiện ích mới"}
              </p>
            </div>
            <CancelButton onClose={onClose} />
          </div>

          {/* Tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Tên tiện ích <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.roomAmenityName}
              onChange={(e) => set("roomAmenityName", e.target.value)}
              placeholder="VD: Bồn tắm, Máy lạnh..."
              maxLength={100}
              autoFocus
              className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border ${
                errors.roomAmenityName
                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                  : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
              }`}
            />
            {errors.roomAmenityName && (
              <span className="text-xs text-red-400">
                {errors.roomAmenityName}
              </span>
            )}
          </div>

          {/* Danh mục */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Danh mục <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("category", opt.value)}
                  className={`px-2.5 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all border ${
                    formData.category === opt.value
                      ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                      : "bg-[#1a1528]/40 border-white/[0.04] text-zinc-400 hover:bg-[#201a33]/60 hover:text-zinc-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <span className="text-xs text-red-400">
                {errors.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <CloseButton onClose={onClose} label="Hủy" />
            <SaveButton
              label={isEdit ? "Cập nhật" : "Thêm"}
              onSave={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenityFormModal;
