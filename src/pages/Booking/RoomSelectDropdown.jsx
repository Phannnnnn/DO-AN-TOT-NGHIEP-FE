import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const DROPDOWN_HEIGHT = 300;

const RoomSelectDropdown = ({
  rooms,
  value,
  onChange,
  disabledIds = [],
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
    setOpen((v) => !v);
  };

  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;

  const showAbove = rect ? spaceBelow < DROPDOWN_HEIGHT + 10 : false;

  const dropdownTop = rect
    ? showAbove
      ? rect.top - DROPDOWN_HEIGHT + 175
      : rect.bottom + 6
    : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-600">
        Chọn phòng <span className="text-red-500">*</span>
      </label>

      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`w-full h-10 px-3.5 rounded-lg text-xs font-bold flex items-center justify-between gap-2 transition-all border ${error
            ? "border-red-500/50"
            : open
              ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.07)]"
              : "border-[rgba(176,38,255,0.15)] bg-white/[0.04] hover:border-[rgba(176,38,255,0.3)]"
          }`}
      >
        {value ? (
          <span className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#b026ff]" />
            <span className="text-gray-200 truncate">
              Phòng {value.roomNumber}
            </span>
            <span className="text-gray-600 text-xs truncate">
              {value.roomType?.typeName} · Tầng {value.floor}
            </span>
          </span>
        ) : (
          <span className="text-gray-600">Chọn phòng...</span>
        )}
        <ChevronDown
          size={13}
          className={`text-gray-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {error && <span className="text-xs text-red-400">{error}</span>}

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
              {rooms.map((r) => {
                const isSelected = value?.roomId === r.roomId;
                const isDisabled = disabledIds.includes(r.roomId);
                return (
                  <button
                    key={r.roomId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(r);
                      setOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors text-left ${isDisabled
                        ? "opacity-30 cursor-not-allowed"
                        : isSelected
                          ? "bg-[rgba(176,38,255,0.12)] cursor-pointer"
                          : "hover:bg-white/[0.05] cursor-pointer"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#b026ff]" />
                      )}
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-[#dda6ff]" : "text-gray-300"}`}
                      >
                        Phòng {r.roomNumber}
                      </span>
                    </span>
                    <span className="text-xs text-gray-600 shrink-0">
                      {r.roomType?.typeName} · Tầng {r.floor}
                      {isDisabled && " · Đã chọn"}
                    </span>
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default RoomSelectDropdown;
