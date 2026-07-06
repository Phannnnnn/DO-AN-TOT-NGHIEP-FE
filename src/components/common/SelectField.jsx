import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );
  const displayText = selectedOption?.label || placeholder || "Chọn...";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-gray-600">{label}</label>
      )}
      <div className="relative">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full h-8 px-3 pr-10 rounded-lg text-left text-xs font-semibold outline-none transition-all border cursor-pointer flex items-center
 ${
   error
     ? "border-red-500/50 focus:border-red-500/50"
     : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_8px_rgba(176,38,255,0.2)] hover:border-white/[0.15]"
 }
 ${!selectedOption ? "text-gray-500" : "text-gray-200"}
 bg-white/[0.04]
 `}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown
            size={14}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 text-gray-500 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Options panel (đã sửa: min-w-max + whitespace-nowrap) */}
        {open && (
          <div className="absolute z-50 mt-1 min-w-max w-full max-h-60 overflow-y-auto rounded-lg border border-[rgba(176,38,255,0.15)] bg-[#1a1425] shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-sm animate-fadeIn">
            {placeholder && (
              <div
                className={`px-3 py-2 text-xs cursor-pointer transition-colors text-gray-500 hover:bg-white/[0.05] border-b border-white/[0.04] whitespace-nowrap`}
                onClick={() => {
                  onChange({ target: { value: "" } });
                  setOpen(false);
                }}
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap
 ${
   String(opt.value) === String(value)
     ? "text-[#dda6ff] bg-[rgba(176,38,255,0.1)]"
     : "text-gray-300 hover:bg-white/[0.05] hover:text-gray-200"
 }
 ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}
 `}
                onClick={() => {
                  if (!opt.disabled) {
                    onChange({ target: { value: opt.value } });
                    setOpen(false);
                  }
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default SelectField;
