import { CircleCheck, DollarSign } from "lucide-react";

const paymentMethodItems = [
  { value: "cash", label: "💵 Tiền mặt" },
  { value: "vnpay", label: "📱 Chuyển khoản VNPAY" },
];

const PaymentMethod = ({
  paymentMethod,
  onSelectMethod,
  onCash,
  cashErrorMessage,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] mb-3 flex items-center gap-1.5">
        <DollarSign size={11} /> Phương thức thanh toán
      </p>
      <div className="flex gap-2">
        {paymentMethodItems.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelectMethod(opt.value)}
            className={`flex-1 h-10 rounded-lg text-[11px] font-black transition-all duration-300 border cursor-pointer ${
              paymentMethod === opt.value
                ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.5)] text-[#dda6ff]"
                : "bg-white/[0.03] border-white/[0.07] text-gray-500 hover:border-white/[0.15] hover:text-gray-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {cashErrorMessage && (
        <span className="text-center text-xs font-semibold text-[var(--red)]">
          {cashErrorMessage}
        </span>
      )}
      <div className="flex justify-end">
        <button
          onClick={onCash}
          className="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[var(--green)] flex items-center justify-center gap-2 bg-[var(--green)]/10 border border-[var(--green)]/10 shadow-[0_4px_16px_rgba(0,200,100,0.2)] hover:bg-[var(--green)]/60 hover:text-[var(--white)] hover:shadow-[0_6px_20px_rgba(0,200,100,0.35)] transition-all cursor-pointer"
        >
          <CircleCheck size={16} /> Thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
