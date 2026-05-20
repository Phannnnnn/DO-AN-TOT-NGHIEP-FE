import CancelButton from "@/components/common/CancelButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import {
  Edit3,
  MapPin,
  Users,
  Bed,
  Info,
  DollarSign,
  Sparkles,
} from "lucide-react";

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  kitchen: "Bếp",
  living: "Phòng khách",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  outdoor: "Ngoài trời",
};

const RoomDetailModal = ({ room, isOpen, onClose, onEdit, statusMap }) => {
  if (!isOpen || !room) return null;

  const status = statusMap[room.status] ?? statusMap[Object.keys(statusMap)[0]];
  const beds = room.roomBeds || [];
  const capacity = room.roomType?.maxOccupancy ?? room.capacity ?? 0;
  const price = room.pricePlan?.basePrice ?? room.roomType?.basePrice;
  const amenities = room.roomTypeAmenities || [];

  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category || "other";
    (acc[cat] = acc[cat] || []).push(a);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.82)] backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden border shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(176,38,255,0.07)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425]"
        style={{ border: "1px solid rgba(176,38,255,0.2)" }}
      >
        {/* Top glow */}
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none blur-[60px] opacity-25"
          style={{ background: status.glow }}
        />

        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        <div className="relative p-8 flex flex-col gap-5 overflow-y-auto max-h-[90vh]">
          {/* Room badge */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              <span
                className="text-2xl font-black"
                style={{ color: status.text }}
              >
                {room.roomNumber}
              </span>
            </div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
              Thông tin chi tiết
            </p>
            <span
              className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase"
              style={{
                background: status.bg,
                color: status.text,
                border: `1px solid ${status.border}`,
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <DetailItem
              icon={<MapPin size={12} />}
              label="Tầng"
              value={`Tầng ${room.floor}`}
            />
            <DetailItem
              icon={<Info size={12} />}
              label="Loại phòng"
              value={room.roomType?.typeName || "—"}
            />
            <DetailItem
              icon={<Users size={12} />}
              label="Sức chứa"
              value={capacity ? `${capacity} người` : "—"}
            />
          </div>

          {/* Beds */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
              <Bed size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                Loại giường
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {beds.length > 0 ? (
                beds.map((bed, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]"
                  >
                    {bed.quantity}× {bed.roomBedType}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-gray-700">
                  Chưa có thông tin
                </span>
              )}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
              <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                <Sparkles size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                  Tiện nghi
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] mb-1.5">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((a) => (
                        <span
                          key={a.roomAmenityId}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-500 border border-white/[0.07] bg-white/[0.03]"
                        >
                          {a.roomAmenityName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(176,38,255,0.08)] border border-[rgba(176,38,255,0.18)]">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] mb-1 text-[#b026ff]">
                Giá
              </p>
              <p className="text-xl font-black text-[#dda6ff]">
                {formatVND(price)}
              </p>
            </div>
            <DollarSign size={26} className="text-[rgba(176,38,255,0.2)]" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => onEdit(room)}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
            >
              <Edit3 size={13} /> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.025]">
    <div className="flex items-center gap-1.5 text-gray-600 mb-1.5">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-[0.1em]">
        {label}
      </span>
    </div>
    <p className="text-[12px] font-bold text-gray-300 ml-[19px]">{value}</p>
  </div>
);

export default RoomDetailModal;
