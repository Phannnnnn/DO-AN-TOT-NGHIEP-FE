import { useState } from "react";
import { UserCheck, Plus, Trash2, Save, Users } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";

const DEFAULT_GUEST = {
  fullName: "",
  idNumber: "",
  phone: "",
  nationality: "Việt Nam",
  dateOfBirth: "",
};

const CheckInModal = ({ isOpen, onClose, onConfirm, booking }) => {
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
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b026ff] to-[#7c3aed]" />

        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        {/* Header */}
        <div className="p-6 pb-4 shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-white">
                Check-in #{booking.bookingId}
              </h3>
              <p className="text-[10px] text-gray-600">
                Nhập thông tin khách lưu trú
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Users size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                Danh sách khách ({guests.length})
              </span>
            </div>
            <button
              onClick={addGuest}
              className="flex items-center gap-1.5 text-[10px] font-black text-[#b026ff] hover:text-[#dda6ff] transition-colors cursor-pointer"
            >
              <Plus size={12} /> Thêm khách
            </button>
          </div>

          {guests.map((guest, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.1em]">
                  Khách {i + 1}
                </span>
                {guests.length > 1 && (
                  <button
                    onClick={() => removeGuest(i)}
                    className="p-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className={fieldClass(errors[`idNumber_${i}`])}
                  />
                </GuestField>

                <GuestField label="Số điện thoại">
                  <input
                    type="text"
                    value={guest.phone}
                    onChange={(e) => updateGuest(i, "phone", e.target.value)}
                    placeholder="0901..."
                    className={fieldClass()}
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

                <GuestField label="Ngày sinh">
                  <input
                    type="date"
                    value={guest.dateOfBirth}
                    onChange={(e) =>
                      updateGuest(i, "dateOfBirth", e.target.value)
                    }
                    className={fieldClass()}
                  />
                </GuestField>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 shrink-0 border-t border-white/[0.05] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] transition-all cursor-pointer"
          >
            <UserCheck size={14} /> Xác nhận Check-in
          </button>
        </div>
      </div>
    </div>
  );
};

const fieldClass = (error) =>
  `w-full h-9 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border ${
    error
      ? "border-red-500/50"
      : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
  }`;

const GuestField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
      {label}
    </label>
    {children}
    {error && <span className="text-[10px] text-red-400">{error}</span>}
  </div>
);

export default CheckInModal;
