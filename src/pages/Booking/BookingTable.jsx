import { Eye, XCircle, CalendarDays } from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

const BookingTable = ({ bookings, statusMap, onView, onCancel }) => {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <CalendarDays size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-bold">Không tìm thấy đơn đặt phòng nào</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGuestName = (booking) =>
    booking.guestName ?? booking.customer?.fullName ?? "—";

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden bg-[#120d1e]/40">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-5xl">
          {/* Header */}
          <div className="grid grid-cols-[4rem_1fr_1fr_8rem_8rem_7rem_8rem] gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            {[
              "#",
              "Khách",
              "Phòng",
              "Ngày tạo",
              "Tổng tiền",
              "Trạng thái",
              "",
            ].map((h, i) => (
              <p
                key={i}
                className={`text-xs font-bold text-gray-600 ${
                  i === 6 ? "text-right" : ""
                }`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {bookings.map((booking, i) => {
            const status = statusMap[booking.status] ?? statusMap.pending;
            const rooms = (booking.bookingDetails ?? [])
              .map((d) => d.room?.roomNumber)
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={booking.bookingId}
                className={`grid grid-cols-[4rem_1fr_1fr_8rem_8rem_7rem_8rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] cursor-pointer ${
                  i !== bookings.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
                }`}
                onClick={() => onView(booking)}
              >
                <p className="text-xs text-gray-700 font-bold">
                  #{booking.bookingId}
                </p>

                <div>
                  <p className="text-sm font-semibold text-gray-200 truncate">
                    {getGuestName(booking)}
                  </p>
                </div>

                <p className="text-xs text-gray-400 truncate">{rooms || "—"}</p>

                <p className="text-xs text-gray-500">
                  {formatDate(booking.createdAt)}
                </p>

                <p className="text-xs font-bold text-[#c77dff]">
                  {formatVND(
                    parseFloat(booking.totalAmount) +
                      parseFloat(booking.serviceAmount),
                  )}
                </p>

                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold border w-fit ${status.bg} ${status.text} ${status.border}`}
                >
                  {status.label}
                </span>

                <div
                  className="flex items-center justify-end gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onView(booking)}
                    className="p-1.5 rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                  </button>
                  {["pending", "confirmed"].includes(booking.status) &&
                    !booking.actualCheckIn &&
                    booking.paymentStatus !== "paid" && (
                      <button
                        onClick={() => onCancel(booking)}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
