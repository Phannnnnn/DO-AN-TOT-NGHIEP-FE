import { ShieldAlert } from "lucide-react";
import { forwardRef } from "react";

const FormInput = forwardRef(
  ({ id, label, icon, validate, placeholder }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-bold text-gray-400 mb-1.5"
        >
          {label}
        </label>
        <div
          className={`${!validate.isValidate ? "border-[#ef4444] bg-[#ef4444]/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-shake" : "border-[#b026ff]/25 bg-[#0a0616]/75 focus-within:border-[#00f0ff] focus-within:shadow-[0_0_15px_rgba(0,240,255,0.45)]"} flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 transition-all`}
          onClick={() => {
            const inputElement = document.getElementById(id);
            inputElement?.focus();
          }}
        >
          {icon && icon}
          <input
            id={id}
            ref={ref}
            type="text"
            onChange={(e) => { }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none p-0 focus:ring-0 border-none shadow-none rounded-none"
          />
        </div>

        {!validate.isValidate && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <ShieldAlert size={12} /> {validate.message}
          </p>
        )}
      </div>
    );
  },
);

export default FormInput;
