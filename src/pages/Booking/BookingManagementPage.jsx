import { useEffect, useState, useMemo } from "react";
import LoadingSection from "@/components/common/LoadingSection";
import { useNotification } from "@/context/ContextProvider";

import BookingTable from "./BookingTable";
import BookingDetailModal from "./BookingDetailModal";
import BookingFormModal from "./BookingFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchPrimary from "@/components/common/SearchPrimary";
import AddButton from "@/components/common/AddButton";
import {
  booking_Service_Service,
  bookingService,
  paymentService,
  service_roomService,
} from "@/services";
import PaymentQRModal from "./PaymentQRModal";
import Pagination from "@/components/common/Pagination";

const paymentTypes = {
  ROOM: { value: "room" },
  SERVICE: { value: "service" },
};

const paymentMethodItems = {
  CASH: { value: "cash", label: "💵 Tiền mặt" },
  VNPAY: { value: "vnpay", label: "📱 Chuyển khoản VNPAY" },
};

const STATUS_MAP = {
  pending: {
    label: "Chờ xác nhận",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  completed: {
    label: "Hoàn thành",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/30",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
};

const STATUS_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const LIMIT_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

const BookingManagementPage = () => {
  const toast = useNotification();
  // Thêm state
  const [qrModal, setQrModal] = useState({
    open: false,
    paymentUrl: "",
    bookingId: null,
  });

  const [paymentType, setPaymentType] = useState(paymentTypes.ROOM.value);
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodItems.CASH.value,
  );
  const [paymentErrors, setPaymentError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(LIMIT_OPTIONS[0]);
  const [totalPage, setTotalPage] = useState(0);

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const bookingsQuery = {
        page: page,
        limit: pageLimit,
      };

      const res = await bookingService.bookings(bookingsQuery);
      console.log(res);
      if (res.success) {
        setBookings(res.data.data || []);
        setTotalPage(res.data.totalPage);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await service_roomService.services();
      if (res.success) {
        setServices(res.data.filter((service) => service.isActive));
      }
    } catch {}
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, [page, pageLimit, totalPage]);

  const handleChangePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const handleChangePaymentType = (type) => {
    setPaymentType(type);
  };

  // ── Actions ──────────────────────────────────────────────
  const handleCreate = async (data) => {
    const { paymentMethod, ...bookingData } = data;
    try {
      const res = await bookingService.create(bookingData);
      if (!res.success) {
        toast.error("Lỗi", extractError(res));
        return;
      }
      setBookings((prev) => [res.data, ...prev]);
      setIsFormOpen(false);
      toast.success("Thành công", "Đặt thành công");
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const handlePayment = async () => {
    const bookingId = selectedBooking.bookingId;
    if (!bookingId) return;

    try {
      if (paymentMethod === paymentMethodItems.CASH.value) {
        let payRes;
        switch (paymentType) {
          case paymentTypes.ROOM.value:
            payRes = await paymentService.payRoomCash(bookingId);
            break;

          case paymentTypes.SERVICE.value:
            payRes = await paymentService.payServiceCash(bookingId);
            break;

          default:
            break;
        }

        if (payRes.success) {
          setBookings((prev) =>
            prev.map((b) => (b.bookingId === bookingId ? payRes.data : b)),
          );
          setSelectedBooking(payRes.data);
          toast.success("Thành công", "Thanh toán thành công");
        }
      }
      if (paymentMethod === paymentMethodItems.VNPAY.value) {
        let payRes;

        switch (paymentType) {
          case paymentTypes.ROOM.value:
            payRes = await paymentService.createRoomPayment(bookingId);
            break;

          case paymentTypes.SERVICE.value:
            payRes = await paymentService.createServicePayment(bookingId);

            break;

          default:
            break;
        }
        if (payRes.success) {
          setQrModal({
            open: true,
            paymentUrl: payRes.data,
            bookingId: bookingId,
          });
        }
      }
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  const handlePaidVnpay = (updatedBooking) => {
    if (!updatedBooking || !updatedBooking.bookingId) {
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === updatedBooking.bookingId ? updatedBooking : b,
      ),
    );

    setSelectedBooking(updatedBooking);
    toast.success("Thành công", "Thanh toán thành công.");
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await bookingService.updateStatus(bookingId, status);
      if (res.success) {
        toast.success("Thành công", "Cập nhật thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const handleCheckIn = async (bookingId, dto) => {
    try {
      const res = await bookingService.checkIn(bookingId, dto);
      if (res.success) {
        toast.success("Thành công", "Nhận phòng thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const res = await bookingService.checkOut(bookingId);
      if (res.success) {
        toast.success("Thành công", "Check-out thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const refreshSelectedBooking = async (bookingId) => {
    const res = await bookingService.bookingById(bookingId);
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
      );
      setSelectedBooking(res.data);
    }
  };

  const handleAddService = async (bookingDetailId, dto) => {
    try {
      const res = await booking_Service_Service.add(bookingDetailId, dto);
      if (res.success) {
        toast.success("Thành công", "Đã thêm dịch vụ.");
        await refreshSelectedBooking(selectedBooking.bookingId);
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const handleRemoveService = async (bookingServiceId) => {
    try {
      const res = await booking_Service_Service.remove(bookingServiceId);
      if (res.success) {
        toast.success("Thành công", "Đã xóa dịch vụ.");
        await refreshSelectedBooking(selectedBooking.bookingId);
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  // ── Filter ────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        const matchStatus = activeFilter === "all" || b.status === activeFilter;
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          String(b.bookingId).includes(q) ||
          b.guestName?.toLowerCase().includes(q) ||
          b.customer?.fullName?.toLowerCase().includes(q) ||
          b.guestPhone?.includes(q);
        return matchStatus && matchSearch;
      }),
    [bookings, activeFilter, searchQuery],
  );

  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 sticky top-0 z-30 bg-[#120d1e]/90 backdrop-blur-md px-4 py-3 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
        <div className={`flex flex-col lg:flex-row gap-3`}>
          <SearchPrimary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Tìm mã booking, tên khách..."
          />
          <div className="flex gap-1 md:gap-2 flex-wrap">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3.5 py-[5px] rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-200 border shrink-0 ${
                  activeFilter === key
                    ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                    : "bg-[#1a1528]/40 text-zinc-400 border-white/[0.04] hover:bg-[#201a33]/60 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <AddButton
            onAddItem={() => setIsFormOpen(true)}
            addLabel="Đặt phòng"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <LoadingSection />
        ) : (
          <>
            <BookingTable
              bookings={filtered}
              statusMap={STATUS_MAP}
              onView={(booking) => {
                setSelectedBooking(booking);
                setIsDetailOpen(true);
              }}
              onCancel={(booking) => {
                if (booking.actualCheckIn) {
                  toast.error("Lỗi", "Không thể hủy đơn đã nhận phòng.");
                  return;
                }
                if (booking.paymentStatus === "paid") {
                  toast.error("Lỗi", "Không thể hủy đơn đã thanh toán.");
                  return;
                }
                setBookingToCancel(booking);
                setConfirmOpen(true);
              }}
            />
            <Pagination
              page={page}
              pageLimit={pageLimit}
              totalPage={totalPage}
              limitOptions={LIMIT_OPTIONS}
              onChangePage={(page) => {
                setPage(page);
              }}
              onChangeLimit={(limit) => {
                setPageLimit(limit);
              }}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <BookingDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        paymentTypes={paymentTypes}
        statusMap={STATUS_MAP}
        onUpdateStatus={handleUpdateStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        paymentMethod={paymentMethod}
        onSelectMethod={handleChangePaymentMethod}
        onSelectPaymentType={handleChangePaymentType}
        onCash={handlePayment}
        paymentErrorsMessage={paymentErrors}
        services={services}
        onAddService={handleAddService}
        onRemoveService={handleRemoveService}
      />

      <BookingFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        services={services}
        paymentMethod={paymentMethod}
        onSelectMethod={handleChangePaymentMethod}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setBookingToCancel(null);
        }}
        onConfirm={() =>
          handleUpdateStatus(bookingToCancel?.bookingId, "cancelled")
        }
        title={`Hủy booking #${bookingToCancel?.bookingId ?? ""}?`}
        description="Hành động này không thể hoàn tác. Đơn đặt phòng sẽ bị hủy."
        confirmLabel="Hủy booking"
      />

      {qrModal.open && (
        <PaymentQRModal
          paymentUrl={qrModal.paymentUrl}
          bookingId={qrModal.bookingId}
          paymentTypes={paymentTypes}
          paymentType={paymentType}
          onClose={() =>
            setQrModal({ open: false, paymentUrl: "", bookingId: null })
          }
          onPaid={handlePaidVnpay}
        />
      )}
    </div>
  );
};

export default BookingManagementPage;
