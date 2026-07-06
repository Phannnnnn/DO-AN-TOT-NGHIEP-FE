import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

/**
 * CustomSelect
 * @param {string} label
 * @param {string} value
 * @param {(v: string) => void} onChange
 * @param {{ value: string, label: string }[]} options
 * @param {Record<string, string>} [colorMap] - value → hex color for dot indicator
 */
const CustomSelect = ({ label, value, onChange, options, colorMap }) => {
  const [open, setOpen] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const btnRef = useRef(null);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const accentColor = colorMap?.[value];

  const handleToggle = () => {
    if (!open && btnRef.current) {
      setDropdownRect(btnRef.current.getBoundingClientRect());
    }
    setOpen((v) => !v);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-gray-600">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`w-full h-11 px-3.5 rounded-lg text-sm font-bold flex items-center justify-between gap-2 transition-all
 border ${open
            ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.07)]"
            : "border-[rgba(176,38,255,0.15)] bg-white/[0.04] hover:border-[rgba(176,38,255,0.3)]"
          }`}
        style={{ color: accentColor ?? "#e5e7eb" }}
      >
        <span className="flex items-center gap-2 truncate">
          {accentColor && (
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: accentColor }}
            />
          )}
          <span className="truncate">{selected?.label}</span>
        </span>
        <ChevronDown
          size={13}
          className={`text-gray-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown — fixed to escape overflow containers */}
      {open && dropdownRect && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[149]"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed z-[150] rounded-lg overflow-hidden border border-[rgba(176,38,255,0.2)] shadow-2xl"
            style={{
              top: dropdownRect.bottom + 6,
              left: dropdownRect.left,
              width: dropdownRect.width,
              background: "#160f24",
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const optColor = colorMap?.[opt.value];
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm flex items-center gap-2 text-left transition-colors
 ${isSelected
                      ? "bg-[rgba(176,38,255,0.12)] font-bold"
                      : "font-medium hover:bg-white/[0.05]"
                    }`}
                  style={{
                    color: optColor ?? (isSelected ? "#dda6ff" : "#9ca3af"),
                  }}
                >
                  {optColor && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: optColor }}
                    />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;
