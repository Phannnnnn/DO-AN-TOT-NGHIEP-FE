import { useState, useEffect } from "react";
import { KeyRound } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";

const ResetPasswordModal = ({ isOpen, user, onClose, onSubmit }) => {
 useNoScroll(isOpen);
 const [formData, setFormData] = useState({
 newPassword: "",
 confirmPassword: "",
 });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (!isOpen) return;
 setFormData({ newPassword: "", confirmPassword: "" });
 setErrors({});
 }, [isOpen]);

 if (!isOpen) return null;

 const handleChange = (key, value) => {
 setFormData((prev) => ({ ...prev, [key]: value }));
 if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
 };

 const validate = () => {
 const errs = {};
 if (!formData.newPassword) errs.newPassword = "Mật khẩu mới là bắt buộc";
 else if (formData.newPassword.length < 6)
 errs.newPassword = "Mật khẩu tối thiểu 6 ký tự";
 if (!formData.confirmPassword)
 errs.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
 else if (formData.newPassword !== formData.confirmPassword)
 errs.confirmPassword = "Mật khẩu xác nhận không khớp";
 return errs;
 };

 const handleSubmit = async () => {
 const errs = validate();
 if (Object.keys(errs).length > 0) {
 setErrors(errs);
 return;
 }

 setLoading(true);
 await onSubmit({ newPassword: formData.newPassword });
 setLoading(false);
 };

  const inputClass = (field) =>
    `h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
      errors[field]
        ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
        : "border-white/[0.08] focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col overflow-hidden">
        {/* Top accent */}
        <div className="h-[3px] bg-sky-500 shrink-0" />

        {/* Header */}
        <div className="p-5 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] flex items-center justify-center bg-sky-500/10 border border-sky-500/20">
              <KeyRound size={18} className="text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-medium text-zinc-100">
                Đặt lại mật khẩu
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cho tài khoản{" "}
                <span className="text-sky-400 font-mono font-medium">
                  {user?.userName}
                </span>
              </p>
            </div>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Form body */}
        <div className="p-5 flex flex-col gap-4">
          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Mật khẩu mới *
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder="••••••••"
              className={inputClass("newPassword")}
            />
            {errors.newPassword && (
              <span className="text-xs text-red-400">
                {errors.newPassword}
              </span>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              placeholder="••••••••"
              className={inputClass("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-400">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-2 flex gap-3 shrink-0 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-[#1a1528]/40 hover:bg-[#201a33]/60 hover:text-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-9 rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <KeyRound size={14} /> Đặt lại mật khẩu
          </button>
        </div>
      </div>
    </div>
 );
};

export default ResetPasswordModal;
