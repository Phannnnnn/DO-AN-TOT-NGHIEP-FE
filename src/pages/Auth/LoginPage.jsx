import FormInput from "@/components/common/FormInput";
import FormInputPassword from "@/components/common/FormInputPassword";
import { useAuth } from "@/context/ContextProvider";
import { KeyRound, ShieldCheck, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const inputRef = useRef({
    userName: null,
    password: null,
  });

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
          toast.success("Đăng nhập thành công.");
          navigate("/", { replace: true });
        } else {
          toast.error(res.message);
        }
      } catch (error) {
      } finally {
        setDisabled(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[58%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a56db 0%, #1e40af 40%, #1d3461 100%)",
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow circles */}
        <div
          className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #60a5fa, transparent)",
          }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #93c5fd, transparent)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="w-16 h-16 rounded-2xl bg-[var(--white)]/15 backdrop-blur-sm border border-[var(--white)]/20 flex items-center justify-center mb-10 shadow-xl">
            <ShieldCheck className="text-[var(--green)]" />
          </div>

          <h1 className="text-5xl font-black text-[var(--white)] mb-5 leading-tight tracking-tight">
            Hotel
            <br />
            Manager
          </h1>

          <p className="text-blue-300 text-lg leading-relaxed max-w-xs font-light">
            Hệ thống quản lý khách sạn thông minh, tối ưu hóa quy trình vận hành
            và nâng cao trải nghiệm khách hàng.
          </p>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            <div className="w-6 h-1.5 rounded-full bg-[var(--white)]" />
            <div className="w-2 h-1.5 rounded-full bg-[var(--white)]/40" />
            <div className="w-2 h-1.5 rounded-full bg-[var(--white)]/40" />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-10">
            {["Quản lý phòng", "Đặt phòng", "Hóa đơn", "Báo cáo"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-[var(--white)]/10 border border-[var(--white)]/20 text-[var(--white)]/80 text-xs font-medium backdrop-blur-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-between bg-[var(--blue_alice)] px-6 py-10">
        <div className="w-full max-w-[400px]">
          {/* Card */}
          <div className="bg-[var(--white)] rounded-2xl shadow-lg p-8">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-7">
              <div className="w-14 h-14 rounded-2xl bg-[var(--blue)]/10 flex items-center justify-center mb-4 shadow-sm">
                <KeyRound className="text-[var(--blue)]" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Đăng nhập</h2>
              <p className="text-sm text-[var(--black)]/60">
                Vui lòng nhập thông tin tài khoản của bạn
              </p>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-4 flex flex-col gap-2">
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
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={disabled}
                className={`${disabled ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 active:scale-[.99] cursor-pointer shadow-md hover:shadow-lg"} w-full py-3 rounded-xl font-semibold text-sm text-[var(--white)] transition-all`}
              >
                Đăng nhập
              </button>
            </form>

            {/* Footer links */}

            <div className="flex items-center justify-center gap-4 mt-4">
              {["Hệ thống", "Hỗ trợ", "Liên hệ"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Version */}
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-6">
          Hotel Manager v.1.0
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        @keyframes fade-in {
          from{opacity:0;transform:translateY(-6px)}
          to{opacity:1;transform:translateY(0)}
        }
        .animate-shake { animation: shake .4s ease; }
        .animate-fade-in { animation: fade-in .3s ease; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default LoginPage;
