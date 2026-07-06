import { User } from "lucide-react";
import Section from "./Section";

const inputClass = (error) =>
  `h-10 px-3 rounded-lg bg-white/[0.04] text-xs font-semibold text-gray-200 outline-none transition-all border w-full ${error
    ? "border-red-500/50 focus:border-red-500"
    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
  }`;

const FormField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-bold text-gray-600">{label}</label>
    )}
    {children}
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

const GuestInputForm = ({
  onOpen,
  onToggle,
  guestNameRef,
  guestEmailRef,
  guest,
  errors,
  onChangeGuestName,
  onChangeGuestPhone,
  onChangeGuestEmail,
  onChangeGuestNotes,
}) => {
  return (
    <Section
      title="Thông tin khách"
      icon={<User size={13} />}
      isOpen={onOpen}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-3">
        <FormField label="Họ tên *" error={errors.guestName}>
          <input
            ref={guestNameRef}
            type="text"
            value={guest.guestName}
            onChange={onChangeGuestName}
            placeholder="Nguyễn Văn A"
            className={inputClass(errors.guestName)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Số điện thoại">
            <input
              type="text"
              value={guest.guestPhone}
              onChange={onChangeGuestPhone}
              placeholder="0901..."
              className={inputClass()}
            />
          </FormField>
          <FormField label="Email *" error={errors.guestEmail}>
            <input
              ref={guestEmailRef}
              type="email"
              value={guest.guestEmail}
              onChange={onChangeGuestEmail}
              placeholder="email@example.com"
              className={inputClass(errors.guestEmail)}
            />
          </FormField>
        </div>

        <FormField label="Ghi chú">
          <textarea
            value={guest.notes}
            onChange={onChangeGuestNotes}
            placeholder="Yêu cầu đặc biệt..."
            rows={2}
            className="px-3 py-2 rounded-lg bg-white/[0.04] text-xs font-semibold text-gray-200 outline-none border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] transition-all w-full resize-none"
          />
        </FormField>
      </div>
    </Section>
  );
};

export default GuestInputForm;
