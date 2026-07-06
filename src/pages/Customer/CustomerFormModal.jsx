import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";
import { DateInput } from "@/components/common/DateRangePicker";

const CustomerFormModal = ({ isOpen, initialData, onClose, onSubmit }) => {
  useNoScroll(isOpen);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    nationality: "Việt Nam",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        nationality: initialData.nationality || "Việt Nam",
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        nationality: "Việt Nam",
        dateOfBirth: "",
      });
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
    if (!formData.fullName.trim()) errs.fullName = "Họ tên không được để trống";
    if (!formData.email.trim()) {
      errs.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email không hợp lệ";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim(),
      address: formData.address.trim() || undefined,
      nationality: formData.nationality.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,
    };

    setLoading(true);
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              {initialData ? "Cập nhật" : "Thêm mới"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {initialData
                ? "Cập nhật thông tin khách hàng"
                : "Tạo khách hàng mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {/* Họ tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Họ tên <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nguyễn Văn A"
              className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                errors.fullName
                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                  : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-red-400">{errors.fullName}</span>
            )}
          </div>

          {/* SĐT & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0901..."
                className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                  errors.phone
                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                    : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
              />
              {errors.phone && (
                <span className="text-xs text-red-400">{errors.phone}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                  errors.email
                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                    : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
              />
              {errors.email && (
                <span className="text-xs text-red-400">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Quốc tịch & Ngày sinh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                Quốc tịch
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="Việt Nam"
                className="h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              {/* <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs font-mono text-zinc-100 outline-none transition-all border w-full ${
                  errors.dateOfBirth
                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                    : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
              />
              {errors.dateOfBirth && (
                <span className="text-xs text-red-400">
                  {errors.dateOfBirth}
                </span>
              )} */}

              <DateInput
                label="Ngày sinh"
                value={formData.dateOfBirth}
                error={errors.dateOfBirth}
                onChange={(date) => handleChange("dateOfBirth", date)}
                required={false}
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Đường ABC, TP. HCM"
              className="h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all w-full"
            />
          </div>
        </div>

        {/* Footer */}
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
            <Save size={14} /> {initialData ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal;
