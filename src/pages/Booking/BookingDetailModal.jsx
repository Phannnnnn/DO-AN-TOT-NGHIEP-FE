import { useState } from "react";
import CancelButton from "@/components/common/CancelButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import {
  User,
  Phone,
  Mail,
  Bed,
  CalendarDays,
  CheckCircle,
  LogIn,
  LogOut,
  DollarSign,
  Sparkles,
  Users,
  IdCard,
} from "lucide-react";
import CheckInModal from "./CheckInModal";
import PaymentMethod from "./PaymentMethod";
import TotalBookingDetail from "./TotalBookingDetail";

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  statusMap,
  onUpdateStatus,
  onCheckIn,
  onCheckOut,
  paymentMethod,
  onSelectMethod,
  onCash,
  cashErrorMessage,
}) => {
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);

  if (!isOpen || !booking) return null;

  const status = statusMap[booking.status] ?? statusMap.pending;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

  const guestName = booking.guestName ?? booking.customer?.fullName ?? "—";
  const guestPhone = booking.guestPhone ?? booking.customer?.phone ?? null;
  const guestEmail = booking.guestEmail ?? booking.customer?.email ?? null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.82)] backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] max-h-[90vh] flex flex-col">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none bg-[#b026ff] blur-[60px] opacity-15" />

        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        {/* Header */}
        <div className="p-6 pb-4 shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-[var(--white)]/60">
              #{booking.bookingId}
            </h3>
          </div>
          <div className="flex justify-center">
            <span
              className={`px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          {/* Guest info */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
              <User size={12} />
              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                Thông tin khách
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] font-bold text-gray-200">{guestName}</p>
              {guestPhone && (
                <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Phone size={10} /> {guestPhone}
                </p>
              )}
              {guestEmail && (
                <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Mail size={10} /> {guestEmail}
                </p>
              )}
              {booking.notes && (
                <p className="text-[11px] text-gray-600 mt-1 italic">
                  "{booking.notes}"
                </p>
              )}
            </div>
          </div>
          {/* Dates + Check-in/out */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
              <CalendarDays size={12} />
              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                Ngày ở
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.1em] mb-1">
                  Ngày nhận phòng dự kiến
                </p>
                <p className="text-[12px] font-bold text-gray-300">
                  {formatDate(booking.checkInDate)}
                </p>
                {booking.actualCheckIn && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle size={9} /> Thực tế:{" "}
                    {formatDateTime(booking.actualCheckIn)}
                  </p>
                )}
              </div>
              <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.1em] mb-1">
                  Ngày trả phòng dự kiến
                </p>
                <p className="text-[12px] font-bold text-gray-300">
                  {formatDate(booking.checkOutDate)}
                </p>
                {booking.actualCheckOut && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle size={9} /> Thực tế:{" "}
                    {formatDateTime(booking.actualCheckOut)}
                  </p>
                )}
              </div>
            </div>

            <p className="text-[10px] text-gray-600 mb-3">{nights} đêm</p>

            {/* Check-in/out actions */}
            {booking.status === "confirmed" && (
              <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                {!booking.actualCheckIn ? (
                  <button
                    onClick={() => setCheckInModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                  >
                    <LogIn size={11} /> Nhận phòng
                  </button>
                ) : !booking.actualCheckOut ? (
                  <button
                    onClick={() => onCheckOut(booking.bookingId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white"
                  >
                    <LogOut size={11} /> Trả phòng
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle size={11} /> Đã trả phòng
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Danh sách khách lưu trú */}
          {booking.guests?.length > 0 && (
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
              <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                <Users size={12} />
                <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                  Khách lưu trú ({booking.guests.length})
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {booking.guests.map((g) => (
                  <div
                    key={g.bookingGuestId}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[12px] font-bold text-gray-200">
                        {g.fullName}
                      </p>
                      <p className="flex items-center gap-1 text-[10px] text-gray-600">
                        <IdCard size={9} /> {g.idNumber}
                      </p>
                      {g.phone && (
                        <p className="text-[10px] text-gray-600">{g.phone}</p>
                      )}
                    </div>
                    <div className="text-right flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-600">
                        {g.nationality}
                      </span>
                      {g.dateOfBirth && (
                        <span className="text-[10px] text-gray-600">
                          {new Date(g.dateOfBirth).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Booking details — phòng + dịch vụ */}
          <div className="flex flex-col gap-3">
            {booking.bookingDetails.map((detail) => {
              const roomTotal =
                Number(detail.priceAtBooking) +
                (detail.services ?? []).reduce(
                  (s, sv) => s + Number(sv.priceAtUsage) * sv.quantity,
                  0,
                );

              return (
                <div
                  key={detail.bookingDetailId}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
                >
                  {/* Ảnh cover */}
                  {(() => {
                    const cover =
                      detail.room?.roomType?.images?.find((i) => i.isCover) ??
                      detail.room?.roomType?.images?.[0];
                    return cover ? (
                      <img
                        src={cover.url}
                        alt={cover.altText ?? "Phòng"}
                        className="w-full h-32 object-cover"
                      />
                    ) : null;
                  })()}

                  <div className="p-3.5">
                    {/* Room header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] flex items-center justify-center shrink-0">
                          <Bed size={14} className="text-[#dda6ff]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-200">
                            Phòng {detail.room?.roomNumber}
                          </p>
                          <p className="text-[10px] text-gray-600">
                            {detail.room?.roomType?.typeName} . Tầng{" "}
                            {detail.room?.floor}
                            {detail.room?.roomType?.maxOccupancy &&
                              ` . Tối đa ${detail.room.roomType.maxOccupancy} người`}
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px] font-bold text-[#c77dff] shrink-0">
                        {formatVND(roomTotal)}
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-600 mb-3">
                      {nights} đêm . Tổng tiền phòng:{" "}
                      {formatVND(Number(detail.priceAtBooking))}
                    </p>

                    {/* Loại giường */}
                    {detail.room?.roomType?.roomBeds?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {detail.room.roomType.roomBeds.map((b, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                          >
                            <Bed size={9} /> {b.quantity} {b.roomBedType}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {(detail.services ?? []).length > 0 && (
                      <div className="pt-2 border-t border-white/[0.04]">
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1">
                          <Sparkles size={10} /> Dịch vụ
                        </p>
                        <div className="flex flex-col gap-1">
                          {(detail.services ?? []).map((sv) => (
                            <div
                              key={sv.bookingServiceId}
                              className="flex items-center justify-between text-[11px]"
                            >
                              <span className="text-gray-400">
                                {sv.service?.serviceName} × {sv.quantity}{" "}
                                {sv.service?.unit}
                              </span>
                              <span className="text-gray-500">
                                {formatVND(
                                  Number(sv.priceAtUsage) * sv.quantity,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Total */}
          <TotalBookingDetail
            paymentMethod={booking.paymentMethod}
            paymentStatus={booking.paymentStatus}
            totalAmount={booking.totalAmount}
          />

          {booking.paymentStatus === "unpaid" && (
            <PaymentMethod
              paymentMethod={paymentMethod}
              onSelectMethod={onSelectMethod}
              onCash={onCash}
              cashErrorMessage={cashErrorMessage}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 pt-4 shrink-0 border-t border-white/[0.05] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {booking.status === "pending" && (
            <button
              onClick={() => onUpdateStatus(booking.bookingId, "confirmed")}
              className="flex-[2] h-11 rounded-xl text-[11px] font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
            >
              <CheckCircle size={13} /> Xác nhận đơn đặt phòng
            </button>
          )}

          {booking.status === "confirmed" && booking.actualCheckOut && (
            <button
              onClick={() => onUpdateStatus(booking.bookingId, "completed")}
              className="flex-[2] h-11 rounded-xl text-[11px] font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
            >
              <CheckCircle size={13} /> Hoàn thành
            </button>
          )}
        </div>
      </div>

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        booking={booking}
        onConfirm={(dto) => {
          onCheckIn(booking.bookingId, dto);
          setCheckInModalOpen(false);
        }}
      />
    </div>
  );
};

export default BookingDetailModal;
