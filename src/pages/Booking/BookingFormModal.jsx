import { useState, useRef } from "react";
import {
  Save,
  ChevronDown,
  Plus,
  Trash2,
  Bed,
  Sparkles,
  User,
  Search,
  Loader2,
  Users,
  Shield,
  DollarSign,
} from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import CancelButton from "@/components/common/CancelButton";
import DateRangePicker from "@/components/common/DateRangePicker";
import Stepper from "@/components/common/Stepper";
import { bookingService } from "@/services";
import RoomSelect from "./RoomSelect";
import Section from "./Section";
import { toast } from "react-toastify";
import ServiceSelect from "./ServiceSelect";
import RemoveButton from "@/components/common/RemoveButton";

const DEFAULT_GUEST = {
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  notes: "",
};
const DEFAULT_ROOM_ITEM = { room: null, services: [] };

const BookingFormModal = ({ isOpen, onClose, onSubmit, services = [] }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [guest, setGuest] = useState(DEFAULT_GUEST);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
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

  const refs = {
    guestName: useRef(null),
    guestEmail: useRef(null),
  };

  const resetSearch = () => {
    setSearched(false);
    setErrorSearched(null);

    setAvailableRooms([]);
    setCombinations([]);
    setSelectedComboIdx(null);
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
    setSearching(true);
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

  const addRoom = () => setRoomItems((p) => [...p, { ...DEFAULT_ROOM_ITEM }]);
  const removeRoom = (i) =>
    setRoomItems((p) => p.filter((_, idx) => idx !== i));
  const updateRoom = (i, key, val) =>
    setRoomItems((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)),
    );

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

  const handleSubmit = () => {
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
    onSubmit({
      guestName: guest.guestName.trim(),
      guestPhone: guest.guestPhone.trim() || undefined,
      guestEmail: guest.guestEmail.trim() || undefined,
      notes: guest.notes.trim() || undefined,
      checkInDate,
      checkOutDate,
      paymentMethod,
      bookingDetails: roomItems.map((item) => ({
        roomId: item.room.roomId,
        services: item.services
          .filter((s) => s.serviceId)
          .map((s) => ({ serviceId: s.serviceId, quantity: s.quantity })),
      })),
    });
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
  const groupedServices = services.reduce((acc, s) => {
    const type = s.serviceType?.typeName ?? "Khác";
    (acc[type] = acc[type] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]">
      <div
        className="w-full max-w-2xl rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425] flex flex-col overflow-hidden"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Đặt phòng
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Điền thông tin để đặt phòng
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6 min-h-0">
          {/* Thông tin khách */}
          <Section
            title="Thông tin khách"
            icon={<User size={13} />}
            isOpen={openSections.guest}
            onToggle={() => toggleSection("guest")}
          >
            <div className="flex flex-col gap-3">
              <FormField label="Họ tên *" error={errors.guestName}>
                <input
                  ref={refs.guestName}
                  type="text"
                  value={guest.guestName}
                  onChange={(e) => setGuestField("guestName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={inputClass(errors.guestName)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Số điện thoại">
                  <input
                    type="text"
                    value={guest.guestPhone}
                    onChange={(e) =>
                      setGuestField("guestPhone", e.target.value)
                    }
                    placeholder="0901..."
                    className={inputClass()}
                  />
                </FormField>
                <FormField label="Email *" error={errors.guestEmail}>
                  <input
                    ref={refs.guestEmail}
                    type="email"
                    value={guest.guestEmail}
                    onChange={(e) =>
                      setGuestField("guestEmail", e.target.value)
                    }
                    placeholder="email@example.com"
                    className={inputClass(errors.guestEmail)}
                  />
                </FormField>
              </div>

              <FormField label="Ghi chú">
                <textarea
                  value={guest.notes}
                  onChange={(e) => setGuestField("notes", e.target.value)}
                  placeholder="Yêu cầu đặc biệt..."
                  rows={2}
                  className="px-3 py-2 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] transition-all w-full resize-none"
                />
              </FormField>
            </div>
          </Section>

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
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
              <Users size={13} className="text-gray-600" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Số khách
              </span>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Stepper
                  label="Người lớn"
                  value={adults}
                  min={1}
                  onChange={(v) => {
                    setAdults(v);
                    resetSearch();
                  }}
                />
                <Stepper
                  label="Trẻ em"
                  value={children}
                  min={0}
                  onChange={(v) => {
                    setChildren(v);
                    resetSearch();
                  }}
                />
              </div>

              <button
                onClick={handleSearchRooms}
                disabled={!checkInDate || !checkOutDate || searching}
                className={`w-full h-10 rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  !checkInDate || !checkOutDate
                    ? "bg-white/[0.04] border border-white/[0.06] text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#b026ff] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(176,38,255,0.3)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.45)] cursor-pointer"
                }`}
              >
                {searching ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Search size={13} />
                )}
                {searching ? "Đang tìm..." : "Tìm phòng phù hợp"}
              </button>

              {searched && (
                <p className="text-[10px] text-center font-semibold">
                  {availableRooms.length === 0 ? (
                    <span className="text-red-400">
                      Không có phòng trống trong khoảng thời gian này
                    </span>
                  ) : combinations.length > 0 ? (
                    <span className="text-emerald-400">
                      Tìm thấy {combinations.length} gợi ý.{" "}
                      {availableRooms.length} phòng trống
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Không có phòng đơn lẻ đủ sức chứa .{" Tìm thấy "}
                      {availableRooms.length} phòng trống.
                    </span>
                  )}
                </p>
              )}

              {errorSearched && (
                <p className="text-[10px] text-center font-semibold">
                  <span className="text-red-400">{errorSearched}</span>
                </p>
              )}
            </div>
          </div>

          {/* Gợi ý tổ hợp phòng */}
          {searched && combinations.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                  Gợi ý tổ hợp phòng
                </p>
                <p className="text-[9px] text-gray-600">
                  Hoặc chọn thủ công bên dưới
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {combinations.map((combo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedComboIdx(idx);
                      setRoomItems(
                        combo.rooms.map((r) => ({ room: r, services: [] })),
                      );
                      setErrors((p) => {
                        const next = { ...p };
                        combo.rooms.forEach((_, i) => delete next[`room_${i}`]);
                        return next;
                      });
                      setOpenSections((p) => ({ ...p, rooms: true }));
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedComboIdx === idx
                        ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.08)]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-[rgba(176,38,255,0.25)] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.08em]">
                        {idx + 1} . {combo.rooms.length} phòng .{" "}
                        {combo.totalCapacity} người
                      </span>
                      {selectedComboIdx === idx && (
                        <span className="text-[9px] font-black text-[#b026ff] uppercase tracking-wider">
                          Đã chọn
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {combo.rooms.map((r) => (
                        <div
                          key={r.roomId}
                          className="flex items-center justify-between"
                        >
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
                            Phòng {r.roomNumber} - Tầng {r.floor} - Loại phòng{" "}
                            {"("}
                            {r.roomType?.typeName}
                            {")"}
                          </span>
                          {r.roomType?.roomBeds?.length > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
                              Giường -{" "}
                              {r.roomType.roomBeds
                                .map((b) => `${b.quantity}x ${b.roomBedType}`)
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn phòng */}
          {searched && availableRooms.length > 0 && (
            <Section
              title="Phòng"
              icon={<Bed size={13} />}
              isOpen={openSections.rooms}
              onToggle={() => toggleSection("rooms")}
            >
              <div className="flex flex-col gap-3">
                {roomItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.1em]">
                        Phòng {i + 1}
                      </p>
                      {roomItems.length > 1 && (
                        <button
                          onClick={() => removeRoom(i)}
                          className="p-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>

                    <RoomSelect
                      rooms={availableRooms}
                      value={item.room}
                      onChange={(room) => {
                        updateRoom(i, "room", room);
                        setErrors((p) => ({ ...p, [`room_${i}`]: undefined }));
                      }}
                      disabledIds={selectedRoomIds.filter(
                        (id) => id !== item.room?.roomId,
                      )}
                      error={errors[`room_${i}`]}
                    />

                    {item.room && (
                      <div className="flex flex-col gap-2">
                        {/* Ảnh cover */}
                        {(() => {
                          const cover =
                            item.room.roomType?.images?.find(
                              (i) => i.isCover,
                            ) ?? item.room.roomType?.images?.[0];
                          return cover ? (
                            <img
                              src={cover.url}
                              alt={cover.altText ?? "Phòng"}
                              className="w-full h-28 object-cover rounded-lg"
                            />
                          ) : null;
                        })()}

                        {/* Loại giường */}
                        {item.room.roomType?.beds?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.room.roomType.beds.map((b, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                              >
                                <Bed size={9} /> {b.quantity} {b.roomBedType}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Giá */}
                        {nights > 0 && (
                          <p className="text-[10px] text-gray-600">
                            {nights} đêm . Giá từ{" "}
                            {formatVND(
                              parseFloat(item.room.roomType?.activePrice ?? 0),
                            )}
                            /đêm
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] flex items-center gap-1">
                          <Sparkles size={10} /> Dịch vụ
                        </p>
                        <button
                          onClick={() => addService(i)}
                          className="text-[9px] font-black text-[#b026ff] hover:text-[#dda6ff] cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Plus size={10} /> Thêm
                        </button>
                      </div>

                      {item.services.map((svc, si) => (
                        <div key={si} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <ServiceSelect
                              services={services}
                              value={svc.serviceId}
                              onChange={(serviceId) => {
                                updateService(i, si, "serviceId", serviceId);
                                setErrors((p) => ({
                                  ...p,
                                  [`svc_${i}_${si}`]: undefined,
                                }));
                              }}
                              error={errors[`svc_${i}_${si}`]}
                            />

                            <div className="flex items-center gap-4">
                              <Stepper
                                min={1}
                                value={svc.quantity}
                                onChange={(newVal) =>
                                  updateService(i, si, "quantity", newVal)
                                }
                              />
                              <div>
                                <RemoveButton
                                  onRemove={() => removeService(i, si)}
                                />
                              </div>
                            </div>
                          </div>
                          {errors[`svc_${i}_${si}`] && (
                            <span className="text-[10px] text-red-400">
                              {errors[`svc_${i}_${si}`]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addRoom}
                  className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-[rgba(176,38,255,0.3)] text-[11px] font-black text-[#b026ff] hover:bg-[rgba(176,38,255,0.06)] transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Thêm phòng
                </button>
              </div>
            </Section>
          )}

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] mb-3 flex items-center gap-1.5">
              <DollarSign size={11} /> Phương thức thanh toán
            </p>
            <div className="flex gap-2">
              {[
                { value: "cash", label: "💵 Tiền mặt" },
                { value: "vnpay", label: "📱 Chuyển khoản VNPAY" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value)}
                  className={`flex-1 h-10 rounded-lg text-[11px] font-black transition-all border cursor-pointer ${
                    paymentMethod === opt.value
                      ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.5)] text-[#dda6ff]"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-500 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {totalPreview > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(176,38,255,0.08)] border border-[rgba(176,38,255,0.18)]">
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#b026ff]">
                Tổng dự tính (ước tính)
              </p>
              <p className="text-xl font-black text-[#dda6ff]">
                {formatVND(totalPreview)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-7 pt-4 flex gap-3 shrink-0 border-t border-white/[0.05] bg-[#0f0a19]">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
          >
            <Save size={14} /> Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
};

const inputClass = (error) =>
  `h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border w-full ${
    error
      ? "border-red-500/50 focus:border-red-500"
      : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
  }`;

const FormField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
        {label}
      </label>
    )}
    {children}
    {error && <span className="text-[10px] text-red-400">{error}</span>}
  </div>
);

export default BookingFormModal;
