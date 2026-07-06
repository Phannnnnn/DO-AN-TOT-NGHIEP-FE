import {
  ArrowRight,
  Banknote,
  CircleCheck,
  DollarSign,
  QrCode,
} from "lucide-react";

const PaymentMethod = ({
  paymentMethod,
  onSelectMethod,
  paymentMethodItems,
  onSelectPaymentType,
  onCash,
  paymentErrorsMessage,
  title,
  confirmLabel = "Thanh toán",
}) => {
  onSelectPaymentType();
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
      <p className="text-xs font-bold text-[var(--red)] flex items-center gap-1.5">
        <DollarSign size={11} /> {title ?? "Phương thức thanh toán"}
      </p>
      <div className="flex gap-2">
        {paymentMethodItems.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelectMethod(opt.value)}
            className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all duration-300 border cursor-pointer ${paymentMethod === opt.value
                ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.5)] text-[#dda6ff]"
                : "bg-white/[0.03] border-white/[0.07] text-gray-500 hover:border-white/[0.15] hover:text-gray-400"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {paymentErrorsMessage && (
        <span className="text-center text-xs font-semibold text-[var(--red)]">
          {paymentErrorsMessage}
        </span>
      )}
      <div className="flex justify-end">
        <button
          onClick={onCash} // hoặc onConfirm
          disabled={!paymentMethod} // chỉ cho click khi đã chọn phương thức
          className={`
 relative flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm 
 transition-all duration-300 ease-out
 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
 ${paymentMethod === "cash"
              ? "text-[var(--white)]/60 hover:text-[var(--white)] bg-[var(--green)]/10 border border-[var(--green)]/20 hover:bg-[var(--green)]/20 active:scale-x-95"
              : paymentMethod === "vnpay"
                ? "text-[var(--white)]/60 hover:text-[var(--white)] bg-[var(--blue)]/10 hover:bg-[var(--blue)]/20 border border-[var(--blue)]/20 active:scale-x-95"
                : ""
            }
 `}
        >
          {/* Icon */}
          <span className="flex-shrink-0">
            {paymentMethod === "cash" ? (
              <Banknote size={18} />
            ) : paymentMethod === "vnpay" ? (
              <QrCode size={18} />
            ) : (
              <CircleCheck size={18} />
            )}
          </span>
          <span>{confirmLabel || "Xác nhận"}</span>

          {/* Mũi tên nhỏ bên phải (tuỳ chọn) */}
          {paymentMethod && (
            <ArrowRight
              size={14}
              className="ml-1 opacity-60 transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
