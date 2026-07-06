import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { DollarSign } from "lucide-react";

const paymentMethodMap = {
  vnpay: {
    label: "VNPAY",
    className:
      "bg-[rgba(55,138,221,0.12)] border-[rgba(55,138,221,0.3)] text-[#85B7EB]",
  },
  cash: {
    label: "Tiền mặt",
    className:
      "bg-[rgba(216,90,48,0.12)] border-[rgba(216,90,48,0.3)] text-[#F0997B]",
  },
};

const paymentStatusMap = {
  paid: {
    label: "Đã thanh toán",
    className:
      "bg-[rgba(29,158,117,0.12)] border-[rgba(29,158,117,0.3)] text-[#5DCAA5]",
  },
  unpaid: {
    label: "Chưa thanh toán",
    className:
      "bg-[rgba(239,159,39,0.12)] border-[rgba(239,159,39,0.3)] text-[#EF9F27]",
  },
  pending: {
    label: "Đang xử lý",
    className:
      "bg-[rgba(136,135,128,0.12)] border-[rgba(136,135,128,0.3)] text-[#888780]",
  },
};

const TotalBookingDetail = ({
  paymentMethod,
  paymentStatus,
  totalAmount,
  servicePaymentMethod,
  servicePaymentStatus,
  serviceAmount,
}) => {
  const method = paymentMethodMap[paymentMethod];
  const status = paymentStatusMap[paymentStatus];
  const svcMethod = paymentMethodMap[servicePaymentMethod];
  const svcStatus = paymentStatusMap[servicePaymentStatus];
  const hasService = parseFloat(serviceAmount) > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Tiền phòng */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#12091e] border border-[rgba(176,38,255,0.2)] gap-4">
        <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(176,38,255,0.12)] border border-[rgba(176,38,255,0.25)]">
          <DollarSign size={18} className="text-[#c77dff]" />
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-xs text-[#6b5a82]">Tiền phòng</span>
          <div className="flex gap-1.5">
            {method && (
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${method.className}`}
              >
                {method.label}
              </span>
            )}
            {status && (
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.className}`}
              >
                {status.label}
              </span>
            )}
          </div>
        </div>

        <div className="w-px h-9 bg-[rgba(176,38,255,0.15)] shrink-0" />

        <div className="text-right shrink-0">
          <p className="text-xl font-medium text-[#dda6ff]">
            {formatVND(parseFloat(totalAmount))}
          </p>
        </div>
      </div>

      {/* Tiền dịch vụ — chỉ hiển thị khi có dịch vụ phát sinh */}
      {hasService && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#12091e] border border-[rgba(176,38,255,0.12)] gap-4">
          <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(176,38,255,0.08)] border border-[rgba(176,38,255,0.15)]">
            <DollarSign size={18} className="text-[#9b5fcf]" />
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs text-[#6b5a82]">Tiền dịch vụ</span>
            <div className="flex gap-1.5">
              {svcMethod && (
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${svcMethod.className}`}
                >
                  {svcMethod.label}
                </span>
              )}
              {svcStatus && (
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${svcStatus.className}`}
                >
                  {svcStatus.label}
                </span>
              )}
            </div>
          </div>

          <div className="w-px h-9 bg-[rgba(176,38,255,0.15)] shrink-0" />

          <div className="text-right shrink-0">
            <p className="text-xl font-medium text-[#c77dff]">
              {formatVND(parseFloat(serviceAmount))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalBookingDetail;
