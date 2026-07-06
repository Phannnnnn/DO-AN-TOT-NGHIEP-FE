import { QRCodeSVG } from "qrcode.react";
import { Copy, X, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { bookingService } from "@/services";
import { useNoScroll } from "@/hooks/useNoScroll";

const PaymentQRModal = ({
  paymentUrl,
  paymentType,
  paymentTypes,
  bookingId,
  onClose,
  onPaid,
}) => {
  useNoScroll(true);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await bookingService.bookingById(bookingId);
        let paymentStatus = "";
        switch (paymentType) {
          case paymentTypes.ROOM.value:
            paymentStatus = res.data.paymentStatus;
            break;

          case paymentTypes.SERVICE.value:
            paymentStatus = res.data.servicePaymentStatus;
            break;

          default:
            break;
        }

        if (paymentStatus === "paid") {
          clearInterval(intervalRef.current);
          onPaid(res.data);
          onClose();
        }
      } catch { }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [bookingId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[8px]">
      <div className="relative w-full max-w-sm rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b026ff] to-[#7c3aed]" />

        <div className="p-6 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs font-bold text-gray-600">
                Thanh toán VNPAY
              </p>
              <p className="text-base font-bold text-white">
                Booking #{bookingId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/10 text-white/30 hover:bg-red-500/30 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* QR */}
          <div className="p-4 rounded-2xl bg-white">
            <QRCodeSVG value={paymentUrl} size={200} />
          </div>

          <p className="text-xs text-gray-500 text-center">
            Đưa mã QR cho khách quét bằng app ngân hàng hoặc ví điện tử
          </p>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.08)] text-[#dda6ff] hover:bg-[rgba(176,38,255,0.15)] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle size={13} /> Đã sao chép
              </>
            ) : (
              <>
                <Copy size={13} /> Sao chép link
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl text-xs font-bold text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRModal;
