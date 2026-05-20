import { useState, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const CALENDAR_HEIGHT = 300;

const toDateStr = (date) => {
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0");
  const D = String(date.getDate()).padStart(2, "0");
  return `${Y}-${M}-${D}`;
};

const CalendarPopup = ({ value, minDate, onSelect, rect, onClose }) => {
  const today = new Date();
  const init = value
    ? new Date(value + "T00:00:00")
    : minDate
      ? new Date(minDate + "T00:00:00")
      : today;
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const spaceBelow = window.innerHeight - rect.bottom;
  const showAbove = spaceBelow < CALENDAR_HEIGHT + 10;
  const top = showAbove ? rect.top - CALENDAR_HEIGHT - 6 : rect.bottom + 6;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return createPortal(
    <>
      <div className="fixed inset-0 z-[149]" onMouseDown={onClose} />
      <div
        className="fixed z-[150] rounded-xl border border-[rgba(176,38,255,0.25)] shadow-2xl p-3 w-[260px]"
        style={{ top, left: rect.left, background: "#160f24" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[12px] font-black text-gray-300">
            {MONTHS_VI[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS_VI.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] font-black text-gray-700 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const dateStr = toDateStr(new Date(viewYear, viewMonth, day));
            const isSelected = value === dateStr;
            const isToday = toDateStr(today) === dateStr;
            const isDisabled = minDate && dateStr < minDate;
            return (
              <button
                key={dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(dateStr)}
                className={`h-8 w-full rounded-lg text-[11px] font-bold transition-all
                    ${
                      isSelected
                        ? "bg-[#b026ff] text-white cursor-pointer"
                        : isDisabled
                          ? "text-gray-700 cursor-not-allowed"
                          : isToday
                            ? "text-[#dda6ff] hover:bg-[rgba(176,38,255,0.15)] cursor-pointer"
                            : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 cursor-pointer"
                    }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </>,
    document.body,
  );
};

const DateInput = ({
  label,
  value,
  minDate,
  onChange,
  error,
  placeholder = "Chọn ngày",
  inputRef,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);

  const formatted = value
    ? new Date(value + "T00:00:00").toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const handleToggle = () => {
    if (disabled) return;

    if (!open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
    setOpen((v) => !v);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
        {label} <span className="text-red-500">*</span>
      </label>

      <button
        ref={(el) => {
          btnRef.current = el;
          if (inputRef) inputRef.current = el;
        }}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full h-10 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-between gap-2 transition-all border ${
          disabled
            ? "border-white/[0.04] bg-white/[0.02] opacity-40 cursor-not-allowed"
            : error
              ? "border-red-500/50 bg-white/[0.04]"
              : open
                ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.07)] cursor-pointer"
                : "border-[rgba(176,38,255,0.15)] bg-white/[0.04] hover:border-[rgba(176,38,255,0.3)] cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarDays
            size={13}
            className={value ? "text-[#b026ff]" : "text-gray-600"}
          />
          <span className={value ? "text-gray-200" : "text-gray-600"}>
            {formatted ?? placeholder}
          </span>
        </div>
        <ChevronDown
          size={13}
          className={`text-gray-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {error && <span className="text-[10px] text-red-400">{error}</span>}

      {open && rect && (
        <CalendarPopup
          value={value}
          minDate={minDate}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
          rect={rect}
        />
      )}
    </div>
  );
};

// forwardRef để BookingFormModal có thể scroll đến DateRangePicker khi validate lỗi
const DateRangePicker = forwardRef(
  (
    {
      checkInDate,
      checkOutDate,
      onChangeCheckIn,
      onChangeCheckOut,
      errorCheckIn,
      errorCheckOut,
      checkInRef,
      checkOutRef,
    },
    ref,
  ) => {
    const today = toDateStr(new Date());

    const minCheckOut = checkInDate
      ? toDateStr(
          new Date(new Date(checkInDate + "T00:00:00").getTime() + 86400000),
        )
      : today;

    const nights = (() => {
      if (!checkInDate || !checkOutDate) return 0;
      return Math.round(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000,
      );
    })();

    return (
      <div
        ref={ref}
        className="rounded-xl border border-white/[0.06] bg-white/[0.01]"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
          <CalendarDays size={13} className="text-gray-600" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.12em]">
            Ngày nhận / trả phòng
          </span>
          {nights > 0 && (
            <span className="ml-auto text-[10px] font-black text-[#b026ff]">
              {nights} đêm
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <DateInput
            label="Ngày nhận phòng"
            value={checkInDate}
            minDate={today}
            onChange={onChangeCheckIn}
            error={errorCheckIn}
            placeholder="Chọn ngày"
            inputRef={checkInRef}
          />
          <DateInput
            label="Ngày trả phòng"
            value={checkOutDate}
            minDate={minCheckOut}
            onChange={onChangeCheckOut}
            error={errorCheckOut}
            disabled={!checkInDate} // <── Thêm dòng này để khóa nếu chưa chọn ngày nhận
            placeholder={
              checkInDate ? "Chọn ngày" : "Chọn ngày nhận phòng trước"
            }
            inputRef={checkOutRef}
          />
        </div>
      </div>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;
