import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import SelectField from "@/components/common/SelectField";
import { useNoScroll } from "@/hooks/useNoScroll";
import ActiveButton from "@/components/common/ActiveButton";

const ROLE_OPTIONS = [
  { value: "USER", label: "Người dùng" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "HOUSEKEEPING", label: "Nhân viên buồng phòng" },
  { value: "RECEPTIONIST", label: "Nhân viên lễ tân" },
];

const UserFormModal = ({ isOpen, initialData, onClose, onSubmit }) => {
  useNoScroll(isOpen);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    fullName: "",
    email: "",
    role: "USER",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        userName: initialData.userName || "",
        password: "",
        fullName: initialData.customer?.fullName || "",
        email: initialData.customer?.email || "",
        role: initialData.role || "USER",
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        userName: "",
        password: "",
        fullName: "",
        email: "",
        role: "USER",
        isActive: true,
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
    if (!isEditing) {
      if (!formData.userName.trim())
        errs.userName = "Tên đăng nhập là bắt buộc";
      else if (formData.userName.length < 6)
        errs.userName = "Tên đăng nhập tối thiểu 6 ký tự";
      if (!formData.password) errs.password = "Mật khẩu là bắt buộc";
      else if (formData.password.length < 8)
        errs.password = "Mật khẩu tối thiểu 8 ký tự";
      if (!formData.fullName.trim()) errs.fullName = "Họ tên là bắt buộc";
      if (!formData.email.trim()) errs.email = "Email là bắt buộc";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
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

    let payload;
    if (isEditing) {
      payload = {
        role: formData.role,
        isActive: formData.isActive,
      };
    } else {
      payload = {
        userName: formData.userName.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };
    }

    setLoading(true);
    await onSubmit(payload);
    setLoading(false);
  };

  const inputClass = (field) =>
    `h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
      errors[field]
        ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
        : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isEditing
                ? `Cập nhật thông tin cho ${initialData.userName}`
                : "Tạo tài khoản người dùng mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {!isEditing && (
            <>
              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    placeholder="nguyenvana"
                    className={`${inputClass("userName")} font-mono`}
                  />
                  {errors.userName && (
                    <span className="text-xs text-red-400">
                      {errors.userName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className={inputClass("password")}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-400">
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>

              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                  Họ tên *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={inputClass("fullName")}
                />
                {errors.fullName && (
                  <span className="text-xs text-red-400">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className={`${inputClass("email")} font-mono`}
                />
                {errors.email && (
                  <span className="text-xs text-red-400">{errors.email}</span>
                )}
              </div>
            </>
          )}

          {/* Role select */}
          <SelectField
            label="Vai trò"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            options={ROLE_OPTIONS}
          />

          {/* Active toggle – only when editing */}
          {isEditing && (
            <ActiveButton
              isActive={formData.isActive}
              label={"Trạng thái tài khoản"}
              onChange={() => {
                handleChange("isActive", !formData.isActive);
              }}
            />
          )}
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
            <Save size={14} /> {isEditing ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
