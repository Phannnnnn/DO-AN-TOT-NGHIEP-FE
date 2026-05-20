import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";

const CustomerFormModal = ({ isOpen, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
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
        idNumber: initialData.idNumber || "",
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
        idNumber: "",
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
    if (!formData.idNumber.trim()) errs.idNumber = "Số định danh là bắt buộc";
    if (
      formData.idNumber &&
      (formData.idNumber.length < 9 || formData.idNumber.length > 20)
    )
      errs.idNumber = "Số định danh từ 9 đến 20 ký tự";
    if (!formData.phone.trim()) errs.phone = "Số điện thoại là bắt buộc";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email không hợp lệ";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Chỉ gửi các trường bắt buộc, bỏ email/address nếu rỗng
    const payload = {
      fullName: formData.fullName.trim(),
      idNumber: formData.idNumber.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      nationality: formData.nationality.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,
    };

    setLoading(true);
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]">
      <div className="w-full max-w-2xl rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              {initialData ? "Sửa khách hàng" : "Thêm khách hàng"}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {initialData
                ? "Cập nhật thông tin khách hàng"
                : "Tạo khách hàng mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          {/* Họ tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Họ tên *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nguyễn Văn A"
              className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                errors.fullName
                  ? "border-red-500/50"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {errors.fullName && (
              <span className="text-[10px] text-red-400">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* CCCD & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                CCCD / CMND *
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                placeholder="123456789"
                className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                  errors.idNumber
                    ? "border-red-500/50"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                }`}
              />
              {errors.idNumber && (
                <span className="text-[10px] text-red-400">
                  {errors.idNumber}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Số điện thoại *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0901..."
                className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                  errors.phone
                    ? "border-red-500/50"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                }`}
              />
              {errors.phone && (
                <span className="text-[10px] text-red-400">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Email & Quốc tịch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                  errors.email
                    ? "border-red-500/50"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                }`}
              />
              {errors.email && (
                <span className="text-[10px] text-red-400">{errors.email}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Quốc tịch
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="Việt Nam"
                className="h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] transition-all w-full"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Đường ABC, TP. HCM"
              className="h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] transition-all w-full"
            />
          </div>

          {/* Ngày sinh */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Ngày sinh
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
                errors.dateOfBirth
                  ? "border-red-500/50"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {errors.dateOfBirth && (
              <span className="text-[10px] text-red-400">
                {errors.dateOfBirth}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
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
            <Save size={14} /> {initialData ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal;
