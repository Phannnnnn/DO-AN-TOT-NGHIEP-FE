import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";

const ServiceTypeFormModal = ({ isOpen, initialData, onClose, onSubmit }) => {
 useNoScroll(isOpen);
 const [formData, setFormData] = useState({
 typeName: "",
 description: "",
 });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (!isOpen) return;
 if (initialData) {
 setFormData({
 typeName: initialData.typeName || "",
 description: initialData.description || "",
 });
 } else {
 setFormData({ typeName: "", description: "" });
 }
 setErrors({});
 }, [isOpen, initialData]);

 if (!isOpen) return null;

 const handleChange = (key, value) => {
 setFormData((prev) => ({ ...prev, [key]: value }));
 if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
 };

 const validate = () => {
 const errs = {};
 if (!formData.typeName.trim())
 errs.typeName = "Tên loại không được để trống";
 return errs;
 };

 const handleSubmit = async () => {
 const errs = validate();
 if (Object.keys(errs).length > 0) {
 setErrors(errs);
 return;
 }

 const payload = {
 typeName: formData.typeName.trim(),
 description: formData.description.trim() || undefined,
 };

 setLoading(true);
 await onSubmit(payload);
 setLoading(false);
 };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col max-h-[90vh]">
        <div className="p-5 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              {initialData ? "Sửa loại dịch vụ" : "Thêm loại dịch vụ"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {initialData ? "Cập nhật thông tin loại" : "Tạo loại dịch vụ mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Tên loại <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.typeName}
              onChange={(e) => handleChange("typeName", e.target.value)}
              placeholder="VD: Đồ uống, Giặt ủi..."
              className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                errors.typeName
                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                  : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
              }`}
            />
            {errors.typeName && (
              <span className="text-xs text-red-400">
                {errors.typeName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn..."
              className="px-3 py-2 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all w-full resize-none"
            />
          </div>
        </div>

        <div className="p-5 pt-4 flex gap-3 shrink-0 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-[#1a1528]/40 hover:bg-[#201a33]/60 hover:text-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-9 rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Save size={14} /> {initialData ? "Cập nhật" : "Tạo loại dịch vụ"}
          </button>
        </div>
      </div>
    </div>
 );
};

export default ServiceTypeFormModal;
