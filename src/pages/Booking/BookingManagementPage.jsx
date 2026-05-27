import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import BookingTable from "./BookingTable";
import BookingDetailModal from "./BookingDetailModal";
import BookingFormModal from "./BookingFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchPrimary from "@/components/common/SearchPrimary";
import AddButton from "@/components/common/AddButton";
import {
  bookingService,
  paymentService,
  roomService,
  service_roomService,
} from "@/services";
import PaymentQRModal from "./PaymentQRModal";

const STATUS_MAP = {
  pending: {
    label: "Chờ xác nhận",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  completed: {
    label: "Hoàn thành",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/30",
  },
};

const STATUS_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const BookingManagementPage = () => {
  // Thêm state
  const [qrModal, setQrModal] = useState({
    open: false,
    paymentUrl: "",
    bookingId: null,
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashError, setCashError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.bookings();
      if (res.success) setBookings(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await service_roomService.services();
      if (res.success) setServices(res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const handleChangePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // ── Actions ──────────────────────────────────────────────
  const handleCreate = async (data) => {
    const { paymentMethod, ...bookingData } = data;
    try {
      const res = await bookingService.create(bookingData);
      if (!res.success) {
        toast.error(extractError(res));
        return;
      }
      setBookings((prev) => [res.data, ...prev]);
      setIsFormOpen(false);
      toast.success("Đặt thành công");
    } catch (e) {
      toast.error(extractError(e));
    }
  };

  const handleCash = async () => {
    const bookingId = selectedBooking.bookingId;

    if (!bookingId) {
      return;
    }

    try {
      if (paymentMethod === "cash") {
        const payRes = await paymentService.payCash(bookingId);
        if (payRes.success) {
          setBookings((prev) =>
            prev.map((b) => (b.bookingId === bookingId ? payRes.data : b)),
          );
          setSelectedBooking(payRes.data);
          toast.success("Thanh toán thành công");
        }
      } else if (paymentMethod === "vnpay") {
        const payRes = await paymentService.createPayment(bookingId);
        if (payRes.success) {
          setQrModal({
            open: true,
            paymentUrl: payRes.data,
            bookingId: bookingId,
          });
        }
      }
    } catch (error) {
      setCashError(error.message);
    }
  };

  const handlePaid = (updatedBooking) => {
    if (!updatedBooking || !updatedBooking.bookingId) {
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === updatedBooking.bookingId ? updatedBooking : b,
      ),
    );

    setSelectedBooking(updatedBooking);
    toast.success("Đặt thành công.");
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await bookingService.updateStatus(bookingId, status);
      if (res.success) {
        toast.success("Cập nhật thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
    }
  };

  const handleCheckIn = async (bookingId, dto) => {
    try {
      const res = await bookingService.checkIn(bookingId, dto);
      if (res.success) {
        toast.success("Check-in thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const res = await bookingService.checkOut(bookingId);
      if (res.success) {
        toast.success("Check-out thành công.");
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? res.data : b)),
        );
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(res.data);
        }
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
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
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#0d0d1a]/85 backdrop-blur-[12px] px-5 py-4 rounded-[0.875rem] border border-violet-500/[0.12] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <SearchPrimary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Tìm mã booking, tên khách..."
          />
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3.5 py-[5px] rounded-[6px] text-[10px] font-black tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border ${
                  activeFilter === key
                    ? "bg-violet-500/25 text-violet-300 border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                    : "bg-white/[0.04] text-gray-500 border-white/[0.06] hover:bg-white/[0.07] hover:text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <AddButton onAddItem={() => setIsFormOpen(true)} addLabel="Đặt phòng" />
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#b026ff]" size={32} />
          </div>
        ) : (
          <BookingTable
            bookings={filtered}
            statusMap={STATUS_MAP}
            onView={(booking) => {
              setSelectedBooking(booking);
              setIsDetailOpen(true);
            }}
            onCancel={(booking) => {
              setBookingToCancel(booking);
              setConfirmOpen(true);
            }}
          />
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
        statusMap={STATUS_MAP}
        onUpdateStatus={handleUpdateStatus}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        paymentMethod={paymentMethod}
        onSelectMethod={handleChangePaymentMethod}
        onCash={handleCash}
        cashErrorMessage={cashError}
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
          onClose={() =>
            setQrModal({ open: false, paymentUrl: "", bookingId: null })
          }
          onPaid={handlePaid}
        />
      )}
    </div>
  );
};

export default BookingManagementPage;
