import { useState, useRef } from "react";
import { useNoScroll } from "@/hooks/useNoScroll";
import { Save, Loader2 } from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import CancelButton from "@/components/common/CancelButton";
import DateRangePicker from "@/components/common/DateRangePicker";
import { bookingService, roomHoldService } from "@/services";
import GuestInputForm from "./GuestInputForm";
import SearchingRoomAvailable from "./SearchingRoomAvailable";
import Combination from "./Combination";
import RoomSelect from "./RoomSelect";
import InputSearch from "./InputSearch";

const DEFAULT_GUEST = {
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  notes: "",
};
const DEFAULT_ROOM_ITEM = { room: null, services: [] };

const BookingFormModal = ({ isOpen, onClose, onSubmit, services = [] }) => {
  useNoScroll(isOpen);

  //Thong tin khach hang
  const [guest, setGuest] = useState(DEFAULT_GUEST);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  //Danh sach phong tu ket qua tim kiem
  const [availableRooms, setAvailableRooms] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [selectedComboIdx, setSelectedComboIdx] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorSearched, setErrorSearched] = useState(false);

  const [roomItems, setRoomItems] = useState([{ ...DEFAULT_ROOM_ITEM }]);

  const [errors, setErrors] = useState({});
  const [openSections, setOpenSections] = useState({
    guest: true,
    rooms: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [holdingSessionId, setHoldingSessionId] = useState(null);
  const holdingSessionIdRef = useRef(null);
  const [holdingRooms, setHoldingRooms] = useState(false);
  const [holdingComboIdx, setHoldingComboIdx] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const refs = {
    guestName: useRef(null),
    guestEmail: useRef(null),
  };

  const releaseHoldingSession = async () => {
    const sessionId = holdingSessionIdRef.current;
    if (!sessionId) return;
    holdingSessionIdRef.current = null;
    setHoldingSessionId(null);
    try {
      await roomHoldService.release(sessionId);
    } catch (err) { }
  };

  const resetForm = () => {
    holdingSessionIdRef.current = null;
    setGuest(DEFAULT_GUEST);
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    setAvailableRooms([]);
    setCombinations([]);
    setSelectedComboIdx(null);
    setHoldingComboIdx(null);
    setSearched(false);
    setErrorSearched(null);
    setRoomItems([{ ...DEFAULT_ROOM_ITEM }]);
    setErrors({});
    setOpenSections({ guest: true, rooms: true });
    setSuccessMessage(null);
    setHoldingSessionId(null);
  };

  const handleClose = async () => {
    await releaseHoldingSession();
    resetForm();
    onClose();
  };

  const holdRooms = async (roomIds) => {
    await releaseHoldingSession();
    const holdRes = await roomHoldService.hold({
      roomIds,
      checkInDate,
      checkOutDate,
    });
    const sessionId = holdRes?.data?.sessionId;
    holdingSessionIdRef.current = sessionId;
    setHoldingSessionId(sessionId);
    return sessionId;
  };

  const resetSearch = async () => {
    await releaseHoldingSession();
    setSearched(false);
    setErrorSearched(null);
    setAvailableRooms([]);
    setCombinations([]);
    setSelectedComboIdx(null);
    setHoldingComboIdx(null);
    setRoomItems([{ ...DEFAULT_ROOM_ITEM }]);
  };

  const handleSearchRooms = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrors((p) => ({
        ...p,
        checkInDate: !checkInDate ? "Chọn ngày nhận phòng" : undefined,
        checkOutDate: !checkOutDate ? "Chọn ngày trả phòng" : undefined,
      }));
      return;
    }
    await releaseHoldingSession();
    setSelectedComboIdx(null);
    setHoldingComboIdx(null);
    setRoomItems([{ ...DEFAULT_ROOM_ITEM }]);
    setSearching(true);
    setErrorSearched(null);
    try {
      const res = await bookingService.getAvailableRooms({
        checkInDate,
        checkOutDate,
        adults,
        children,
      });

      if (res.success) {
        const data = res.data || {};
        setAvailableRooms(data.availableRooms || []);
        setCombinations(data.combinations || []);
        setSelectedComboIdx(null);
        setHoldingComboIdx(null);
        setSearched(true);
        setRoomItems([{ ...DEFAULT_ROOM_ITEM }]);
      }
    } catch (error) {
      setErrorSearched(error?.message);
    } finally {
      setSearching(false);
    }
  };

  if (!isOpen) return null;

  const toggleSection = (key) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const setGuestField = (key, val) => {
    setGuest((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined, guestContact: undefined }));
  };

  const addRoom = () => {
    setRoomItems((p) => [...p, { ...DEFAULT_ROOM_ITEM }]);
    if (holdingSessionId) {
      releaseHoldingSession();
    }
  };
  const removeRoom = async (i) => {
    setRoomItems((p) => p.filter((_, idx) => idx !== i));
    // Release session nếu đang giữ phòng theo kiểu thủ công
    // (không có combo được chọn, hoặc roomItems đã khác với combo)
    if (holdingSessionId) {
      const afterRemove = roomItems.filter((_, idx) => idx !== i);
      const afterRoomIdsKey = afterRemove
        .map((it) => it.room?.roomId)
        .filter(Boolean)
        .sort()
        .join(",");
      const selectedComboRoomIdsKey =
        selectedComboIdx !== null
          ? [
            ...(combinations[selectedComboIdx]?.rooms.map((r) => r.roomId) ??
              []),
          ]
            .sort()
            .join(",")
          : null;
      const willBeManual =
        selectedComboIdx === null ||
        afterRoomIdsKey !== selectedComboRoomIdsKey;
      if (willBeManual) {
        await releaseHoldingSession();
      }
    }
  };
  const updateRoom = (i, key, val) => {
    setRoomItems((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)),
    );
    // Phòng thay đổi → session cũ không còn hợp lệ
    if (key === "room" && holdingSessionId) {
      releaseHoldingSession();
    }
  };

  const addService = (roomIdx) =>
    setRoomItems((p) =>
      p.map((item, idx) =>
        idx === roomIdx
          ? {
            ...item,
            services: [...item.services, { serviceId: null, quantity: 1 }],
          }
          : item,
      ),
    );
  const removeService = (roomIdx, svcIdx) =>
    setRoomItems((p) =>
      p.map((item, idx) =>
        idx === roomIdx
          ? {
            ...item,
            services: item.services.filter((_, si) => si !== svcIdx),
          }
          : item,
      ),
    );
  const updateService = (roomIdx, svcIdx, key, val) =>
    setRoomItems((p) =>
      p.map((item, idx) =>
        idx === roomIdx
          ? {
            ...item,
            services: item.services.map((s, si) =>
              si === svcIdx ? { ...s, [key]: val } : s,
            ),
          }
          : item,
      ),
    );

  const validate = () => {
    const e = {};
    if (!guest.guestName.trim()) {
      e.guestName = "Tên khách không được để trống.";
    }

    if (!guest.guestEmail.trim()) {
      e.guestEmail = "Email không được để trống.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.guestEmail.trim())) {
      e.guestEmail = "Email không hợp lệ.";
    }

    if (!checkInDate) {
      e.checkInDate = "Chọn ngày nhận phòng.";
    }
    if (!checkOutDate) {
      e.checkOutDate = "Chọn ngày trả phòng.";
    }
    if (checkInDate && checkOutDate && checkInDate >= checkOutDate) {
      e.checkOutDate = "Ngày trả phòng phải sau ngày nhận phòng.";
      roomItems.forEach((item, i) => {
        if (!item.room) e[`room_${i}`] = "Chọn phòng.";
        item.services.forEach((s, si) => {
          if (!s.serviceId) e[`svc_${i}_${si}`] = "Chọn dịch vụ.";
        });
      });
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.guestName) {
        setOpenSections((p) => ({ ...p, guest: true }));
        setTimeout(() => refs.guestName.current?.focus(), 50);
      } else if (e.guestEmail) {
        setOpenSections((p) => ({ ...p, guest: true }));
        setTimeout(() => refs.guestEmail.current?.focus(), 50);
      }
      return;
    }

    if (!holdingSessionId) {
      setErrors((p) => ({
        ...p,
        booking: "Vui lòng xác nhận giữ phòng trước khi đặt.",
      }));
      return;
    }

    setSubmitting(true);
    setSuccessMessage(null);

    try {
      await onSubmit({
        guestName: guest.guestName.trim(),
        guestPhone: guest.guestPhone.trim() || undefined,
        guestEmail: guest.guestEmail.trim() || undefined,
        notes: guest.notes.trim() || undefined,
        checkInDate,
        checkOutDate,
        sessionId: holdingSessionId,
        bookingDetails: roomItems.map((item) => ({
          roomId: item.room.roomId,
          services: item.services
            .filter((s) => s.serviceId)
            .map((s) => ({ serviceId: s.serviceId, quantity: s.quantity })),
        })),
      });
      setSubmitting(false);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1200);
    } catch (err) {
      await releaseHoldingSession();
      setErrors((p) => ({
        ...p,
        booking: err?.message || "Đặt phòng không thành công.",
      }));
      setSubmitting(false);
    }
  };

  const nights = (() => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.max(
      1,
      Math.round((new Date(checkOutDate) - new Date(checkInDate)) / 86400000),
    );
  })();

  const totalPreview = roomItems.reduce((total, item) => {
    const price = parseFloat(item.room?.roomType?.activePrice ?? 0);
    const svcTotal = item.services.reduce((s, sv) => {
      const svc = services.find((x) => x.serviceId === sv.serviceId);
      return s + (svc ? parseFloat(svc.price) * sv.quantity : 0);
    }, 0);
    return total + price * nights + svcTotal;
  }, 0);

  const selectedRoomIds = roomItems.map((i) => i.room?.roomId).filter(Boolean);

  const currentRoomIdsKey = [...selectedRoomIds].sort().join(",");
  const selectedComboRoomIdsKey =
    selectedComboIdx !== null
      ? [...(combinations[selectedComboIdx]?.rooms.map((r) => r.roomId) ?? [])]
        .sort()
        .join(",")
      : null;
  const isManualMode =
    selectedComboIdx === null || currentRoomIdsKey !== selectedComboRoomIdsKey;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]">
      <div
        className="w-full max-w-2xl rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-lg font-bold text-white">Đặt phòng</h2>
            <p className="text-xs text-gray-600 mt-1">
              Điền thông tin để đặt phòng
            </p>
          </div>
          <CancelButton onClose={handleClose} />
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6 min-h-0">
          {/* Thông tin khách */}
          <GuestInputForm
            onOpen={openSections.guest}
            onToggle={() => toggleSection("guest")}
            guestNameRef={refs.guestName}
            guestEmailRef={refs.guestEmail}
            guest={guest}
            errors={errors}
            onChangeGuestName={(e) =>
              setGuestField("guestName", e.target.value)
            }
            onChangeGuestPhone={(e) =>
              setGuestField("guestPhone", e.target.value)
            }
            onChangeGuestEmail={(e) =>
              setGuestField("guestEmail", e.target.value)
            }
            onChangeGuestNotes={(e) => setGuestField("notes", e.target.value)}
          />

          {/* Ngày ở */}
          <DateRangePicker
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onChangeCheckIn={(val) => {
              setCheckInDate(val);
              if (checkOutDate && val >= checkOutDate) setCheckOutDate("");
              setErrors((p) => ({
                ...p,
                checkInDate: undefined,
                checkOutDate: undefined,
              }));
              resetSearch();
            }}
            onChangeCheckOut={(val) => {
              setCheckOutDate(val);
              setErrors((p) => ({ ...p, checkOutDate: undefined }));
              resetSearch();
            }}
            errorCheckIn={errors.checkInDate}
            errorCheckOut={errors.checkOutDate}
          />

          {/* Số khách */}
          <InputSearch
            adults={adults}
            setAdults={setAdults}
            children={children}
            resetSearch={resetSearch}
            setChildren={setChildren}
          />

          <SearchingRoomAvailable
            onSearch={handleSearchRooms}
            disabled={!checkInDate || !checkOutDate}
            searching={searching}
            searched={searched}
            availableRooms={availableRooms}
            combinations={combinations}
            errors={errors}
            successMessage={successMessage}
            errorSearched={errorSearched}
          />

          {/* Gợi ý tổ hợp phòng */}
          <Combination
            searched={searched}
            combinations={combinations}
            selectedComboIdx={selectedComboIdx}
            holdingComboIdx={holdingComboIdx}
            holdingSessionId={holdingSessionId}
            setHoldingRooms={setHoldingRooms}
            setHoldingComboIdx={setHoldingComboIdx}
            setErrors={setErrors}
            holdRooms={holdRooms}
            setSelectedComboIdx={setSelectedComboIdx}
            setRoomItems={setRoomItems}
            setOpenSections={setOpenSections}
          />

          {/* Chọn phòng */}
          <RoomSelect
            searched={searched}
            services={services}
            availableRooms={availableRooms}
            onOpen={openSections.rooms}
            onToggle={() => toggleSection("rooms")}
            roomItems={roomItems}
            holdingRooms={holdingRooms}
            onAddRoom={addRoom}
            holdingSessionId={holdingSessionId}
            onRemoveRoom={removeRoom}
            errors={errors}
            setErrors={setErrors}
            onUpdateRoom={updateRoom}
            selectedRoomIds={selectedRoomIds}
            nights={nights}
            onAddService={addService}
            onUpdateService={updateService}
            onRemoveService={removeService}
            isManualMode={isManualMode}
            setHoldingRooms={setHoldingRooms}
            setSelectedComboIdx={setSelectedComboIdx}
            holdRooms={holdRooms}
          />

          {totalPreview > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(176,38,255,0.08)] border border-[rgba(176,38,255,0.18)]">
              <p className="text-xs font-bold text-[#b026ff]">Tổng</p>
              <p className="text-xl font-bold text-[#dda6ff]">
                {formatVND(totalPreview)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-7 pt-4 flex gap-3 shrink-0 border-t border-white/[0.05] bg-[#0f0a19]">
          <button
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl text-xs font-bold text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !holdingSessionId}
            className={`flex-[2] h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] transition-all ${submitting || !holdingSessionId
                ? "opacity-40 cursor-not-allowed"
                : "shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] cursor-pointer"
              }`}
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {submitting ? "Đang đặt..." : "Đặt phòng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
