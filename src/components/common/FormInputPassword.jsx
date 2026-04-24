import { Eye, EyeOff, LockKeyhole, ShieldAlert } from "lucide-react";
import { forwardRef, useState } from "react";

const FormInputPassword = forwardRef(
  ({ id, label, validate, placeholder }, ref) => {
    const [showPass, setShowPass] = useState(false);

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--black)]/80 mb-1.5"
        >
          {label}
        </label>
        <div
          className={`${!validate.isValidate ? "border-[var(--red)] bg-[var(--red)]/5" : "border-[var(--black)]/30 focus-within:border-[var(--blue)] focus-within:bg-[var(--white)] focus-within:shadow-sm"} flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 transition-all`}
          onClick={() => {
            const inputElement = document.getElementById(id);
            inputElement?.focus();
          }}
        >
          <LockKeyhole size={16} absoluteStrokeWidth />
          <input
            id={id}
            ref={ref}
            type={showPass ? "text" : "password"}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-[var(--black)]/90 placeholder-[var(--black)]/60 outline-none"
            autoComplete={id}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="text-[var(--slate)]/60 hover:text-[var(--slate)] transition-colors flex-shrink-0 cursor-pointer"
          >
            {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {!validate.isValidate && (
          <p className="text-xs text-[var(--red)] mt-1 flex items-center gap-1">
            <ShieldAlert size={12} /> {validate.message}
          </p>
        )}
      </div>
    );
  },
);

export default FormInputPassword;
