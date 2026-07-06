import { useState, useRef, useEffect, forwardRef } from "react";
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

const CalendarPopup = ({
  value,
  minDate,
  maxDate,
  onSelect,
  rect,
  onClose,
}) => {
  const today = new Date();
  const init = value
    ? new Date(value + "T00:00:00")
    : minDate
      ? new Date(minDate + "T00:00:00")
      : today;
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowMonthSelect(false);
        setShowYearSelect(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const spaceBelow = window.innerHeight - rect.bottom;
  const showAbove = spaceBelow < CALENDAR_HEIGHT + 10;
  const top = showAbove ? rect.top - CALENDAR_HEIGHT - 6 : rect.bottom + 6;
  const POPUP_WIDTH = Math.min(260, window.innerWidth - 16);

  const clampedLeft = Math.max(
    8,
    Math.min(rect.left, window.innerWidth - POPUP_WIDTH - 8),
  );

  const prevMonth = () => {
    setShowMonthSelect(false);
    setShowYearSelect(false);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    setShowMonthSelect(false);
    setShowYearSelect(false);
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

  // Generate Year options dynamically (last 100 years to 10 years in the future, constrained by minDate/maxDate)
  const currentYear = today.getFullYear();
  let startYear = currentYear - 100;
  let endYear = currentYear + 10;
  if (minDate) {
    const minD = new Date(minDate + "T00:00:00");
    if (!isNaN(minD.getTime())) {
      startYear = Math.max(startYear, minD.getFullYear());
    }
  }
  if (maxDate) {
    const maxD = new Date(maxDate + "T00:00:00");
    if (!isNaN(maxD.getTime())) {
      endYear = Math.min(endYear, maxD.getFullYear());
    }
  }
  const yearOptions = [];
  for (let y = endYear; y >= startYear; y--) {
    yearOptions.push(y);
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[149]" onMouseDown={onClose} />
      <div
        ref={containerRef}
        className="fixed z-[150] rounded-[8px] border border-white/[0.08] bg-[#120d1e]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.65)] p-3 w-[calc(100vw-16px)] max-w-[260px]"
        style={{ top, left: clampedLeft }}
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

          <div className="flex items-center gap-1 select-none">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMonthSelect(!showMonthSelect);
                  setShowYearSelect(false);
                }}
                className="text-[10px] font-bold text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-md px-1.5 py-1 flex items-center gap-0.5 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
              >
                {MONTHS_VI[viewMonth]}
                <ChevronDown
                  size={10}
                  className={`text-gray-500 transition-transform duration-200 ${showMonthSelect ? "rotate-180" : ""}`}
                />
              </button>

              {showMonthSelect && (
                <div className="absolute top-full left-0 mt-1 w-24 bg-[#120d1e] border border-white/[0.08] rounded-[6px] shadow-2xl z-[160] max-h-36 overflow-y-auto dropdown-scrollbar py-1">
                  {MONTHS_VI.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setViewMonth(idx);
                        setShowMonthSelect(false);
                      }}
                      className={`w-full text-left px-2 py-1 text-[10px] font-medium hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        viewMonth === idx
                          ? "text-violet-300 bg-violet-500/10"
                          : "text-zinc-400"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowYearSelect(!showYearSelect);
                  setShowMonthSelect(false);
                }}
                className="text-[10px] font-bold text-gray-300 bg-white/[0.04] border border-white/[0.08] rounded-md px-1.5 py-1 flex items-center gap-0.5 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
              >
                {viewYear}
                <ChevronDown
                  size={10}
                  className={`text-gray-500 transition-transform duration-200 ${showYearSelect ? "rotate-180" : ""}`}
                />
              </button>

              {showYearSelect && (
                <div className="absolute top-full right-0 mt-1 w-20 bg-[#120d1e] border border-white/[0.08] rounded-[6px] shadow-2xl z-[160] max-h-36 overflow-y-auto dropdown-scrollbar py-1">
                  {yearOptions.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setViewYear(y);
                        setShowYearSelect(false);
                      }}
                      className={`w-full text-left px-2 py-1 text-[10px] font-medium hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        viewYear === y
                          ? "text-violet-300 bg-violet-500/10"
                          : "text-zinc-400"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
              className="text-center text-xs font-bold text-gray-700 py-1"
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
            const isDisabled =
              (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate);
            return (
              <button
                key={dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(dateStr)}
                className={`h-8 w-full rounded-[6px] text-xs font-medium font-mono transition-all
 ${
   isSelected
     ? "bg-violet-600 text-white cursor-pointer"
     : isDisabled
       ? "text-zinc-700 cursor-not-allowed"
       : isToday
         ? "text-violet-300 hover:bg-violet-500/10 cursor-pointer"
         : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 cursor-pointer"
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

export const DateInput = ({
  label,
  value,
  minDate,
  maxDate,
  onChange,
  error,
  placeholder = "Chọn ngày",
  inputRef,
  disabled,
  required = true,
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
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[11px] font-medium text-[var(--white)]/80">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <button
        ref={(el) => {
          btnRef.current = el;
          if (inputRef) inputRef.current = el;
        }}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full min-h-10 px-3 rounded-[6px] text-xs font-medium flex items-center justify-between gap-2 transition-all border ${
          disabled
            ? "border-white/[0.04] bg-white/[0.02] opacity-40 cursor-not-allowed"
            : error
              ? "border-red-500/40 bg-[#161224]/50 focus:border-red-500/60"
              : open
                ? "border-violet-500/50 bg-[#161224]/80 cursor-pointer"
                : "border-white/[0.08] bg-[#161224]/50 hover:border-violet-500/30 cursor-pointer"
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

      {error && !disabled && (
        <span className="text-xs text-red-400">{error}</span>
      )}

      {open && rect && (
        <CalendarPopup
          value={value}
          minDate={minDate}
          maxDate={maxDate}
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
      minCheckInDate,
      maxCheckInDate,
      minCheckOutDate,
      maxCheckOutDate,
      variant = "default",
      labelFrom = "Ngày nhận phòng",
      labelTo = "Ngày trả phòng",
      required = true,
      allowSameDay = false,
    },
    ref,
  ) => {
    const today = toDateStr(new Date());

    const finalMinCheckIn =
      minCheckInDate !== undefined ? minCheckInDate : today;

    const minCheckOut = checkInDate
      ? toDateStr(
          new Date(
            new Date(checkInDate + "T00:00:00").getTime() +
              (allowSameDay ? 0 : 86400000),
          ),
        )
      : minCheckOutDate !== undefined
        ? minCheckOutDate
        : today;

    const nights = (() => {
      if (!checkInDate || !checkOutDate) return 0;
      return Math.round(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000,
      );
    })();

    if (variant === "inline") {
      return (
        <div ref={ref} className="flex flex-col md:flex-row">
          <DateInput
            label={labelFrom}
            value={checkInDate}
            minDate={minCheckInDate}
            maxDate={maxCheckInDate}
            onChange={onChangeCheckIn}
            error={errorCheckIn}
            placeholder="Từ ngày"
            inputRef={checkInRef}
            required={required}
          />
          <span className="text-zinc-600 text-xs my-2 md:my-0 md:mt-4 shrink-0 text-center">
            →
          </span>
          <DateInput
            label={labelTo}
            value={checkOutDate}
            minDate={minCheckOut}
            maxDate={maxCheckOutDate}
            onChange={onChangeCheckOut}
            error={errorCheckOut}
            placeholder="Đến ngày"
            inputRef={checkOutRef}
            required={required}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="rounded-[8px] border border-white/[0.06] bg-[#120d1e]/80 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3 border-b border-white/[0.04]">
          <CalendarDays size={13} className="text-zinc-500" />
          <span className="text-xs font-medium text-zinc-400">
            Ngày nhận / trả phòng
          </span>
          {nights > 0 && (
            <span className="sm:ml-auto text-xs font-mono font-medium text-violet-300">
              {nights} đêm
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4">
          <DateInput
            label={labelFrom}
            value={checkInDate}
            minDate={finalMinCheckIn}
            maxDate={maxCheckInDate}
            onChange={onChangeCheckIn}
            error={errorCheckIn}
            placeholder="Chọn ngày"
            inputRef={checkInRef}
            required={required}
          />
          <DateInput
            label={labelTo}
            value={checkOutDate}
            minDate={minCheckOut}
            maxDate={maxCheckOutDate}
            onChange={onChangeCheckOut}
            error={errorCheckOut}
            disabled={!checkInDate}
            placeholder={
              checkInDate ? "Chọn ngày" : "Chọn ngày nhận phòng trước"
            }
            inputRef={checkOutRef}
            required={required}
          />
        </div>
      </div>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;
