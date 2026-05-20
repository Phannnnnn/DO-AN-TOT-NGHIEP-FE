import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

const DROPDOWN_HEIGHT = 300;

const ServiceSelect = ({ services, value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);

  // Group services by serviceType
  const grouped = services.reduce((acc, s) => {
    const type = s.serviceType?.typeName ?? "Khác";
    (acc[type] = acc[type] || []).push(s);
    return acc;
  }, {});

  const selectedService = services.find((s) => s.serviceId === value);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
    setOpen((v) => !v);
  };

  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;
  const showAbove = spaceBelow < DROPDOWN_HEIGHT + 10;
  const dropdownTop = rect
    ? showAbove
      ? rect.top - DROPDOWN_HEIGHT + 155
      : rect.bottom + 6
    : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`w-full h-10 px-3.5 rounded-lg text-[12px] font-bold flex items-center justify-between gap-2 transition-all border ${
          error
            ? "border-red-500/50"
            : open
              ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.07)]"
              : "border-[rgba(176,38,255,0.15)] bg-white/[0.04] hover:border-[rgba(176,38,255,0.3)]"
        }`}
      >
        {selectedService ? (
          <span className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#b026ff]" />
            <span className="text-gray-200 truncate">
              {selectedService.serviceName}
            </span>
            <span className="text-gray-600 text-[11px] truncate">
              {formatVND(parseFloat(selectedService.price))}/
              {selectedService.unit}
            </span>
          </span>
        ) : (
          <span className="text-gray-600">Chọn dịch vụ</span>
        )}
        <ChevronDown
          size={13}
          className={`text-gray-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {error && <span className="text-[10px] text-red-400">{error}</span>}

      {open &&
        rect &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[298]"
              onMouseDown={() => setOpen(false)}
            />
            <div
              className="fixed z-[299] rounded-lg border border-[rgba(176,38,255,0.2)] shadow-2xl overflow-y-auto"
              style={{
                top: dropdownTop,
                left: rect.left,
                width: rect.width,
                maxHeight: DROPDOWN_HEIGHT,
                background: "#160f24",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {Object.entries(grouped).map(([type, svcs]) => (
                <div key={type}>
                  <div className="px-3.5 py-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider border-b border-white/[0.06]">
                    {type}
                  </div>
                  {svcs.map((s) => {
                    const isSelected = s.serviceId === value;
                    return (
                      <button
                        key={s.serviceId}
                        type="button"
                        onClick={() => {
                          onChange(s.serviceId);
                          setOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors text-left ${
                          isSelected
                            ? "bg-[rgba(176,38,255,0.12)] cursor-pointer"
                            : "hover:bg-white/[0.05] cursor-pointer"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#b026ff]" />
                          )}
                          <span
                            className={`text-[12px] font-bold ${isSelected ? "text-[#dda6ff]" : "text-gray-300"}`}
                          >
                            {s.serviceName}
                          </span>
                        </span>
                        <span className="text-[10px] text-gray-600 shrink-0">
                          {formatVND(parseFloat(s.price))}/{s.unit}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default ServiceSelect;
