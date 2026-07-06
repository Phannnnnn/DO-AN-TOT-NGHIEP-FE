import { useState } from "react";
import { useNoScroll } from "@/hooks/useNoScroll";
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
  Sparkles,
  Users,
  IdCard,
  ChevronDown,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  RotateCcw,
  ScanSearch,
} from "lucide-react";
import CheckInModal from "./CheckInModal";
import PaymentMethod from "./PaymentMethod";
import TotalBookingDetail from "./TotalBookingDetail";
import ServiceSelect from "./ServiceSelect";
import Stepper from "@/components/common/Stepper";
import CloseButton from "@/components/common/CloseButton";

const paymentMethodItems = [
  { value: "cash", label: "💵 Tiền mặt" },
  { value: "vnpay", label: "📱 Chuyển khoản VNPAY" },
];

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  paymentTypes,
  statusMap,
  onUpdateStatus,
  onCheckIn,
  onCheckOut,
  paymentMethod,
  onSelectMethod,
  onSelectPaymentType,
  onCash,
  paymentErrorsMessage,
  services = [],
  onAddService,
  onRemoveService,
}) => {
  useNoScroll(isOpen);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  const [addSvcState, setAddSvcState] = useState({});
  const [addingSvcId, setAddingSvcId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  if (!isOpen || !booking) return null;

  const status = statusMap[booking.status] ?? statusMap.pending;
  const canEditServices =
    (booking.status === "pending" || booking.status === "confirmed") &&
    booking.servicePaymentStatus !== "paid";

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

  const isInRange = (fromDate, toDate) => {
    const today = new Date();
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  };

  const nights = (() => {
    const a = new Date(booking.checkInDate);
    const b = new Date(booking.checkOutDate);
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  })();

  const guestName = booking.guestName ?? booking.customer?.fullName ?? "—";
  const guestPhone = booking.guestPhone ?? booking.customer?.phone ?? null;
  const guestEmail = booking.guestEmail ?? booking.customer?.email ?? null;

  // ── Shared card styles ────────────────────────────────────────
  const cardBase =
    "absolute inset-0 w-full h-full rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] flex flex-col overflow-hidden";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.2)] backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Perspective wrapper */}
      <div
        className="relative w-full max-w-2xl max-h-[90dvh]"
        style={{ height: "90dvh", perspective: "1200px" }}
      >
        {/* Flip container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ══ MẶT TRƯỚC ══ */}
          <div className={cardBase} style={{ backfaceVisibility: "hidden" }}>
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none bg-[#b026ff] blur-[60px] opacity-15" />
            <div className="absolute top-5 right-5 z-10">
              <CancelButton onClose={onClose} />
            </div>

            {/* Header */}
            <div className="p-6 pb-4 shrink-0 border-b border-white/[0.05]">
              <h3 className="text-xl font-bold text-[var(--white)]/60">
                #{booking.bookingId}
              </h3>
              <div className="flex justify-center mt-1">
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold border ${status.bg} ${status.text} ${status.border}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 min-h-0 p-6 flex flex-col gap-4">
              {/* Guest info */}
              <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
                <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                  <User size={12} />
                  <span className="text-xs font-bold">Thông tin khách</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-bold text-gray-200">{guestName}</p>
                  {guestPhone && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={10} /> {guestPhone}
                    </p>
                  )}
                  {guestEmail && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail size={10} /> {guestEmail}
                    </p>
                  )}
                  {booking.notes && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      "{booking.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Dates + Check-in/out */}
              <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
                <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                  <CalendarDays size={12} />
                  <span className="text-xs font-bold">Ngày ở</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                    <p className="text-xs font-bold text-gray-600 mb-1">
                      Ngày nhận phòng dự kiến
                    </p>
                    <p className="text-xs font-bold text-gray-300">
                      {formatDate(booking.checkInDate)}
                    </p>
                    {booking.actualCheckIn && (
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={9} /> Thực tế:{" "}
                        {formatDateTime(booking.actualCheckIn)}
                      </p>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                    <p className="text-xs font-bold text-gray-600 mb-1">
                      Ngày trả phòng dự kiến
                    </p>
                    <p className="text-xs font-bold text-gray-300">
                      {formatDate(booking.checkOutDate)}
                    </p>
                    {booking.actualCheckOut && (
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={9} /> Thực tế:{" "}
                        {formatDateTime(booking.actualCheckOut)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">{nights} đêm</p>
              </div>

              {/* Booking details summary */}
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
                      {(() => {
                        const cover =
                          detail.room?.roomType?.images?.find(
                            (i) => i.isCover,
                          ) ?? detail.room?.roomType?.images?.[0];
                        return cover ? (
                          <img
                            src={cover.url}
                            alt={cover.altText ?? "Phòng"}
                            className="w-full h-32 object-cover"
                          />
                        ) : null;
                      })()}
                      <div className="p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] flex items-center justify-center shrink-0">
                              <Bed size={14} className="text-[#dda6ff]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-200">
                                Phòng {detail.room?.roomNumber}
                              </p>
                              <p className="text-xs text-gray-600">
                                {detail.room?.roomType?.typeName} . Tầng{" "}
                                {detail.room?.floor}
                                {detail.room?.roomType?.maxOccupancy &&
                                  ` . Tối đa ${detail.room.roomType.maxOccupancy} người`}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-[#c77dff] shrink-0">
                            {formatVND(roomTotal)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                          {nights} đêm . Tổng tiền phòng:{" "}
                          {formatVND(Number(detail.priceAtBooking))}
                        </p>
                        {detail.room?.roomType?.roomBeds?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {detail.room.roomType.roomBeds.map((b, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                              >
                                <Bed size={9} /> {b.quantity} {b.roomBedType}
                              </span>
                            ))}
                          </div>
                        )}

                        {(detail.services ?? []).length > 0 && (
                          <div className="pt-2 border-t border-white/[0.04]">
                            <p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                              <Sparkles size={10} /> Dịch vụ
                            </p>
                            <div className="flex flex-col gap-1">
                              {(detail.services ?? []).map((sv) => (
                                <div
                                  key={sv.bookingServiceId}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-gray-400">
                                    {sv?.serviceName} × {sv?.quantity}{" "}
                                    {sv?.unit}
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

              <TotalBookingDetail
                paymentMethod={booking.paymentMethod}
                paymentStatus={booking.paymentStatus}
                totalAmount={booking.totalAmount}
                servicePaymentMethod={booking.servicePaymentMethod}
                servicePaymentStatus={booking.servicePaymentStatus}
                serviceAmount={booking.serviceAmount ?? 0}
              />

              {booking.paymentStatus === "unpaid" && (
                <PaymentMethod
                  title={`Thanh toán tiền phòng : ${formatVND(Number(booking.totalAmount))}`}
                  onSelectPaymentType={() => {
                    onSelectPaymentType(paymentTypes.ROOM.value);
                  }}
                  paymentMethod={paymentMethod}
                  paymentMethodItems={paymentMethodItems}
                  onSelectMethod={onSelectMethod}
                  onCash={onCash}
                  paymentErrorsMessage={paymentErrorsMessage}
                />
              )}
              <div>
                {booking.status === "confirmed" && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.04]">
                    {!booking.actualCheckIn ? (
                      <div className="">
                        <button
                          disabled={
                            !isInRange(
                              booking.checkInDate,
                              booking.checkOutDate,
                            )
                          }
                          onClick={() => {
                            setCheckInModalOpen(true);
                          }}
                          className="px-4 py-3 flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all bg-[var(--green)]/10 hover:bg-[var(--green)]/20 border border-[var(--green)]/20 text-[var(--green)]/60 hover:text-[var(--white)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--green)]/10 disabled:hover:text-[var(--green)]/60 cursor-pointer"
                        >
                          <LogIn size={16} /> Nhận phòng
                        </button>
                      </div>
                    ) : !booking.actualCheckOut ? (
                      <>
                        {Number(booking.serviceAmount) > 0 &&
                        booking.servicePaymentStatus === "unpaid" ? (
                          <PaymentMethod
                            title={`Thanh toán dịch vụ : ${formatVND(Number(booking.serviceAmount))}`}
                            paymentMethod={paymentMethod}
                            onSelectMethod={onSelectMethod}
                            paymentMethodItems={paymentMethodItems}
                            onSelectPaymentType={() => {
                              onSelectPaymentType(paymentTypes.SERVICE.value);
                            }}
                            onCash={onCash}
                            paymentErrorsMessage={paymentErrorsMessage}
                          />
                        ) : null}
                        <button
                          onClick={() => onCheckOut(booking.bookingId)}
                          disabled={
                            Number(booking.serviceAmount) > 0 &&
                            booking.servicePaymentStatus === "unpaid"
                          }
                          className="px-4 py-3 flex items-center justify-center gap-1.5 rounded-lg font-bold transition-all bg-[var(--blue)]/10 border border-[var(--blue)]/30 text-[var(--blue)]/60 hover:bg-[var(--blue)]/20 disabled:hover:text-[var(--blue)]/60 disabled:hover:bg-[var(--blue)]/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <LogOut size={16} /> Trả phòng
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle size={11} /> Đã trả phòng
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer mặt trước */}
            <div className="p-6 pt-4 shrink-0 border-t border-white/[0.05] flex gap-3">
              <CloseButton label="Đóng" onClose={onClose} />
              <button
                onClick={() => setFlipped(true)}
                className="flex-1 h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.07)] text-[#c77dff] hover:bg-[rgba(176,38,255,0.14)] transition-all cursor-pointer"
              >
                <ScanSearch size={13} /> Chi tiết đơn
              </button>
              {booking.status === "pending" && (
                <button
                  onClick={() => onUpdateStatus(booking.bookingId, "confirmed")}
                  disabled={booking.paymentStatus === "unpaid"}
                  className="flex-[2] h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <CheckCircle size={13} /> Xác nhận đơn
                </button>
              )}
              {booking.status === "confirmed" && booking.actualCheckOut && (
                <button
                  onClick={() => onUpdateStatus(booking.bookingId, "completed")}
                  className="flex-[2] h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
                >
                  <CheckCircle size={13} /> Hoàn thành
                </button>
              )}
            </div>
          </div>

          {/* ══ MẶT SAU ══ */}
          <div
            className={cardBase}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none bg-[#b026ff] blur-[60px] opacity-15" />

            {/* Header mặt sau */}
            <div className="p-6 pb-4 shrink-0 border-b border-white/[0.05]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--white)]/60">
                  #{booking.bookingId}
                </h3>
                <span className="text-xs font-bold text-[#b026ff] border border-[rgba(176,38,255,0.3)] px-2 py-0.5 rounded-md bg-[rgba(176,38,255,0.08)]">
                  Chi tiết đơn
                </span>
              </div>
            </div>

            {/* Body mặt sau */}
            <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
              {/* Chi tiết từng phòng */}
              <div className="flex flex-col gap-3">
                {booking.bookingDetails.map((detail) => {
                  const isExpanded =
                    expandedDetailId === detail.bookingDetailId;
                  const roomTotal =
                    Number(detail.priceAtBooking) +
                    (detail.services ?? []).reduce(
                      (s, sv) => s + Number(sv.priceAtUsage) * sv.quantity,
                      0,
                    );
                  const addSvc = addSvcState[detail.bookingDetailId] ?? {
                    serviceId: null,
                    quantity: 1,
                  };

                  return (
                    <div
                      key={detail.bookingDetailId}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden"
                    >
                      {/* Clickable header */}
                      <button
                        onClick={() =>
                          setExpandedDetailId(
                            isExpanded ? null : detail.bookingDetailId,
                          )
                        }
                        className="w-full flex items-center justify-between px-3.5 py-3 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] flex items-center justify-center shrink-0">
                            <Bed size={14} className="text-[#dda6ff]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-200">
                              Phòng {detail.room?.roomNumber}
                            </p>
                            <p className="text-xs text-gray-600">
                              {detail.room?.roomType?.typeName} · Tầng{" "}
                              {detail.room?.floor}
                              {detail.room?.roomType?.maxOccupancy &&
                                ` · Tối đa ${detail.room.roomType.maxOccupancy} người`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-xs font-bold text-[#c77dff]">
                            {formatVND(roomTotal)}
                          </p>
                          <ChevronDown
                            size={13}
                            className={`text-gray-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 flex flex-col gap-3 border-t border-white/[0.04]">
                          {(() => {
                            const cover =
                              detail.room?.roomType?.images?.find(
                                (i) => i.isCover,
                              ) ?? detail.room?.roomType?.images?.[0];
                            return cover ? (
                              <img
                                src={cover.url}
                                alt={cover.altText ?? "Phòng"}
                                className="w-full h-48 object-cover rounded-lg mt-3"
                              />
                            ) : null;
                          })()}

                          <p className="text-xs text-gray-600 mt-1">
                            {nights} đêm · Tiền phòng:{" "}
                            {formatVND(Number(detail.priceAtBooking))}
                          </p>

                          {detail.room?.roomType?.roomBeds?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {detail.room.roomType.roomBeds.map((b, idx) => (
                                <span
                                  key={idx}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                                >
                                  <Bed size={9} /> {b.quantity} {b.roomBedType}
                                </span>
                              ))}
                            </div>
                          )}

                          {detail.room?.roomType?.description && (
                            <p className="text-xs text-gray-500 italic leading-relaxed">
                              {detail.room.roomType.description}
                            </p>
                          )}

                          {detail.room?.roomType?.amenities?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                <ShieldCheck size={10} /> Tiện nghi
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {detail.room.roomType.amenities.map((a) => (
                                  <span
                                    key={a.roomAmenityId}
                                    className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                                  >
                                    {a.roomAmenityName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dịch vụ */}
                          <div className="pt-2 border-t border-white/[0.04]">
                            <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                              <Sparkles size={10} /> Dịch vụ
                            </p>
                            {(detail.services ?? []).length > 0 ? (
                              <div className="flex flex-col gap-1 mb-2">
                                {(detail.services ?? []).map((sv) => (
                                  <div
                                    key={sv.bookingServiceId}
                                    className="flex items-center justify-between text-xs group"
                                  >
                                    <span className="text-gray-400">
                                      {sv?.serviceName} × {sv.quantity}{" "}
                                      {sv?.unit}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">
                                        {formatVND(
                                          Number(sv.priceAtUsage) * sv.quantity,
                                        )}
                                      </span>
                                      {canEditServices && (
                                        <button
                                          disabled={
                                            removingId === sv.bookingServiceId
                                          }
                                          onClick={() => {
                                            setRemovingId(sv.bookingServiceId);
                                            onRemoveService(
                                              sv.bookingServiceId,
                                            ).finally(() =>
                                              setRemovingId(null),
                                            );
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-red-400 hover:text-red-300 cursor-pointer disabled:opacity-40"
                                        >
                                          {removingId ===
                                          sv.bookingServiceId ? (
                                            <Loader2
                                              size={10}
                                              className="animate-spin"
                                            />
                                          ) : (
                                            <Trash2 size={10} />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-600 mb-2">
                                Chưa có dịch vụ
                              </p>
                            )}

                            {canEditServices && services.length > 0 && (
                              <div className="flex flex-col gap-2 mt-2">
                                <ServiceSelect
                                  services={services}
                                  value={addSvc.serviceId || null}
                                  onChange={(serviceId) =>
                                    setAddSvcState((p) => ({
                                      ...p,
                                      [detail.bookingDetailId]: {
                                        ...addSvc,
                                        serviceId,
                                      },
                                    }))
                                  }
                                />
                                <div className="flex gap-2 justify-end">
                                  <Stepper
                                    min={1}
                                    value={addSvc.quantity}
                                    onChange={(quantity) =>
                                      setAddSvcState((p) => ({
                                        ...p,
                                        [detail.bookingDetailId]: {
                                          ...addSvc,
                                          quantity,
                                        },
                                      }))
                                    }
                                  />
                                  <button
                                    disabled={
                                      !addSvc.serviceId ||
                                      addingSvcId === detail.bookingDetailId
                                    }
                                    onClick={async () => {
                                      if (!addSvc.serviceId) return;
                                      setAddingSvcId(detail.bookingDetailId);
                                      await onAddService(
                                        detail.bookingDetailId,
                                        {
                                          serviceId: Number(addSvc.serviceId),
                                          quantity: addSvc.quantity,
                                        },
                                      );
                                      setAddSvcState((p) => ({
                                        ...p,
                                        [detail.bookingDetailId]: {
                                          serviceId: null,
                                          quantity: 1,
                                        },
                                      }));
                                      setAddingSvcId(null);
                                    }}
                                    className="h-11 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.3)] text-[#b026ff] hover:bg-[rgba(176,38,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                  >
                                    {addingSvcId === detail.bookingDetailId ? (
                                      <Loader2
                                        size={11}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Plus size={11} />
                                    )}
                                    Thêm
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Khách lưu trú */}
              {booking.guests?.length > 0 ? (
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
                  <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                    <Users size={12} />
                    <span className="text-xs font-bold">
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
                          <p className="text-xs font-bold text-gray-200">
                            {g.fullName}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-gray-600">
                            <IdCard size={9} /> {g.idNumber}
                          </p>
                          {g.phone && (
                            <p className="text-xs text-gray-600">{g.phone}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col gap-0.5">
                          <span className="text-xs text-gray-600">
                            {g.nationality}
                          </span>
                          {g.dateOfBirth && (
                            <span className="text-xs text-gray-600">
                              {new Date(g.dateOfBirth).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-600">
                  <Users size={28} className="opacity-30" />
                  <p className="text-xs">Chưa có khách lưu trú</p>
                  {booking.status === "confirmed" && !booking.actualCheckIn && (
                    <p className="text-xs text-gray-700">
                      Danh sách sẽ được thêm khi nhận phòng
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer mặt sau */}
            <div className="p-6 pt-4 shrink-0 border-t border-white/[0.05] flex gap-3">
              <button
                onClick={() => setFlipped(false)}
                className="flex-1 h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-gray-400 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Quay lại
              </button>
            </div>
          </div>
        </div>
        {/* end flip container */}
      </div>
      {/* end perspective wrapper */}

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
