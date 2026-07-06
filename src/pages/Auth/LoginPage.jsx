import FormInput from "@/components/common/FormInput";
import FormInputPassword from "@/components/common/FormInputPassword";
import SubmitButton from "@/components/common/SubmitButton";
import { useAuth, useNotification } from "@/context/ContextProvider";
import { KeyRound, ShieldCheck, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useNotification();
  const inputRef = useRef({
    userName: null,
    password: null,
  });

  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [validate, setValidate] = useState({
    userName: { isValidate: true, message: "" },
    password: { isValidate: true, message: "" },
  });

  const handleValidate = (userName, password) => {
    const newValidate = {
      userName: { isValidate: true, message: "" },
      password: { isValidate: true, message: "" },
    };

    if (!password) {
      newValidate.password = {
        isValidate: false,
        message: "Trường này không được để trống.",
      };
    }

    if (!userName) {
      newValidate.userName = {
        isValidate: false,
        message: "Trường này được để trống.",
      };
    }

    setValidate(newValidate);
    return newValidate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = inputRef.current.userName?.value.trim() || "";
    const password = inputRef.current.password?.value.trim() || "";

    const resultValidate = handleValidate(userName, password);
    if (
      resultValidate.userName.isValidate &&
      resultValidate.password.isValidate
    ) {
      setDisabled(true);
      try {
        const userLoginData = {
          userName: userName,
          password: password,
        };

        const res = await login(userLoginData);
        if (res.success) {
          toast.success("Thành công", "Đăng nhập thành công.");
          navigate("/", { replace: true });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setDisabled(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#070511] z-[9999] font-sans">
      <div className="hidden lg:flex lg:w-[58%] h-full relative overflow-hidden bg-[linear-gradient(135deg,#070511_0%,#0b0816_60%,#110d22_100%)]">
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Minimal soft ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="w-12 h-12 rounded-[8px] bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-10 shadow-sm">
            <ShieldCheck className="text-violet-400" size={24} />
          </div>

          <h1 className="text-5xl font-bold mb-5 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              LUMISTAY
            </span>
            <br />
            <span className="text-white text-4xl font-light tracking-wide">
              QUẢN LÝ
            </span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
            Hệ thống quản lý khách sạn thông minh, tối ưu hóa quy trình vận hành
            và nâng cao trải nghiệm khách hàng.
          </p>

          {/* Dots */}
          <div className="flex gap-1.5 mt-10">
            <div className="w-6 h-1 rounded-[2px] bg-violet-500" />
            <div className="w-2 h-1 rounded-[2px] bg-white/[0.08]" />
            <div className="w-2 h-1 rounded-[2px] bg-white/[0.08]" />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-10">
            {["Quản lý phòng", "Đặt phòng", "Hóa đơn", "Báo cáo"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-[4px] bg-white/[0.02] border border-white/[0.06] text-slate-400 text-xs font-mono backdrop-blur-sm hover:border-white/[0.15] hover:text-white transition-all duration-200 cursor-default"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full bg-[#070511] px-6 py-8 overflow-y-auto">
        {/* Wrapper to center the card vertically */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-[480px]">
            {/* Minimalist Glass Card */}
            <div className="rounded-[8px] p-8 md:p-10 bg-[#120d20]/50 backdrop-blur-md border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] animate-fade-in">
              {/* Logo + Title */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-[8px] bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-4 shadow-sm">
                  <KeyRound className="text-violet-400" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                  Đăng nhập
                </h2>
                <p className="text-xs text-slate-400">
                  Vui lòng nhập thông tin tài khoản của bạn
                </p>
              </div>

              {/* ── FORM ── */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6 flex flex-col gap-4">
                  <FormInput
                    ref={(e) => (inputRef.current.userName = e)}
                    id={"userName"}
                    label={"Tên đăng nhập"}
                    icon={<User size={16} absoluteStrokeWidth />}
                    placeholder="Email hoặc tên đăng nhập"
                    validate={validate.userName}
                  />
                  <FormInputPassword
                    ref={(e) => (inputRef.current.password = e)}
                    id={"password"}
                    label={"Mật khẩu"}
                    placeholder="Mật khẩu"
                    validate={validate.password}
                  />

                  {error && (
                    <span className="text-red-400 text-xs font-mono ml-1">
                      {error}
                    </span>
                  )}
                </div>

                <SubmitButton disabled={disabled} title={"Đăng nhập"} />
              </form>

              {/* Footer links */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {["Hệ thống", "Hỗ trợ", "Liên hệ"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Version: bottom */}
        <div className="text-center pt-4 mt-auto">
          <p className="text-[10px] font-mono tracking-widest text-slate-600 uppercase">
            LUMISTAY QUẢN LÝ v.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
