import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";

const ServiceTypeFormModal = ({ isOpen, initialData, onClose, onSubmit }) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              {initialData ? "Sửa loại dịch vụ" : "Thêm loại dịch vụ"}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {initialData ? "Cập nhật thông tin loại" : "Tạo loại dịch vụ mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Tên loại *
            </label>
            <input
              type="text"
              value={formData.typeName}
              onChange={(e) => handleChange("typeName", e.target.value)}
              placeholder="VD: Đồ uống, Giặt ủi..."
              className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                errors.typeName
                  ? "border-red-500/50"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {errors.typeName && (
              <span className="text-[10px] text-red-400">
                {errors.typeName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn..."
              className="px-3 py-2 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] transition-all w-full resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-4 flex gap-3 shrink-0 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} /> {initialData ? "Cập nhật" : "Tạo loại dịch vụ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeFormModal;
