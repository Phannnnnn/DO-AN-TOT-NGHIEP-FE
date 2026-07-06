import { useState } from "react";
import { UserCheck, Plus, Trash2, Users } from "lucide-react";
import { useNoScroll } from "@/hooks/useNoScroll";
import CancelButton from "@/components/common/CancelButton";
import { DateInput } from "@/components/common/DateRangePicker";

const DEFAULT_GUEST = {
  fullName: "",
  idNumber: "",
  phone: "",
  nationality: "Việt Nam",
  dateOfBirth: "",
};

const CheckInModal = ({ isOpen, onClose, onConfirm, booking }) => {
  useNoScroll(isOpen);
  const [guests, setGuests] = useState([{ ...DEFAULT_GUEST }]);
  const [errors, setErrors] = useState({});

  if (!isOpen || !booking) return null;

  const addGuest = () => setGuests((p) => [...p, { ...DEFAULT_GUEST }]);
  const removeGuest = (i) => setGuests((p) => p.filter((_, idx) => idx !== i));
  const updateGuest = (i, key, val) =>
    setGuests((p) => p.map((g, idx) => (idx === i ? { ...g, [key]: val } : g)));

  const validate = () => {
    const e = {};
    guests.forEach((g, i) => {
      if (!g.fullName.trim()) e[`fullName_${i}`] = "Bắt buộc";
      if (!g.idNumber.trim()) e[`idNumber_${i}`] = "Bắt buộc";
    });
    return e;
  };

  const handleConfirm = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onConfirm({
      guests: guests.map((g) => ({
        fullName: g.fullName.trim(),
        idNumber: g.idNumber.trim(),
        phone: g.phone.trim() || undefined,
        nationality: g.nationality.trim() || "Việt Nam",
        dateOfBirth: g.dateOfBirth || undefined,
      })),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col max-h-[90vh]">
        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        {/* Header */}
        <div className="p-5 pb-4 shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-[6px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-medium text-zinc-100">
                Nhận phòng #{booking.bookingId}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Nhập thông tin khách lưu trú
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Users size={12} />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Danh sách khách ({guests.length})
              </span>
            </div>
          </div>
          {guests.map((guest, i) => (
            <div
              key={i}
              className="p-4 rounded-[8px] border border-white/[0.04] bg-[#1a1528]/10 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  Khách {i + 1}
                </span>
                {guests.length > 1 && (
                  <button
                    onClick={() => removeGuest(i)}
                    className="p-1 rounded-[4px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <GuestField label="Họ tên *" error={errors[`fullName_${i}`]}>
                  <input
                    type="text"
                    value={guest.fullName}
                    onChange={(e) => {
                      updateGuest(i, "fullName", e.target.value);
                      setErrors((p) => ({
                        ...p,
                        [`fullName_${i}`]: undefined,
                      }));
                    }}
                    placeholder="Nguyễn Văn A"
                    className={fieldClass(errors[`fullName_${i}`])}
                  />
                </GuestField>

                <GuestField
                  label="CCCD / Passport *"
                  error={errors[`idNumber_${i}`]}
                >
                  <input
                    type="text"
                    value={guest.idNumber}
                    onChange={(e) => {
                      updateGuest(i, "idNumber", e.target.value);
                      setErrors((p) => ({
                        ...p,
                        [`idNumber_${i}`]: undefined,
                      }));
                    }}
                    placeholder="012345678901"
                    className={`${fieldClass(errors[`idNumber_${i}`])} font-mono`}
                  />
                </GuestField>

                <GuestField label="Số điện thoại">
                  <input
                    type="text"
                    value={guest.phone}
                    onChange={(e) => updateGuest(i, "phone", e.target.value)}
                    placeholder="0901..."
                    className={`${fieldClass()} font-mono`}
                  />
                </GuestField>

                <GuestField label="Quốc tịch">
                  <input
                    type="text"
                    value={guest.nationality}
                    onChange={(e) =>
                      updateGuest(i, "nationality", e.target.value)
                    }
                    placeholder="Việt Nam"
                    className={fieldClass()}
                  />
                </GuestField>

                <div className="flex flex-col gap-1">
                  <DateInput
                    label="Ngày sinh"
                    value={guest.dateOfBirth}
                    onChange={(date) => updateGuest(i, "dateOfBirth", date)}
                    required={false}
                    placeholder="Chọn ngày sinh"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end px-2">
            <button
              onClick={addGuest}
              className="flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-400 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Plus size={12} /> Thêm khách lưu trú
            </button>
          </div>{" "}
        </div>

        {/* Footer */}
        <div className="p-5 pt-4 shrink-0 border-t border-white/[0.05] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-[#1a1528]/40 hover:bg-[#201a33]/60 hover:text-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] h-9 rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer active:scale-[0.98]"
          >
            <UserCheck size={14} /> Xác nhận nhận phòng
          </button>
        </div>
      </div>
    </div>
  );
};

const fieldClass = (error) =>
  `w-full h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border ${
    error
      ? "border-red-500/40 focus:border-red-500/60"
      : "border-white/[0.08] focus:border-violet-500/50"
  }`;

const GuestField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
      {label}
    </label>
    {children}
    {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
  </div>
);

export default CheckInModal;
