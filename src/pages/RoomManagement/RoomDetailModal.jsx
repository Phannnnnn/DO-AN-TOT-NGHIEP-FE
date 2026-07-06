import CancelButton from "@/components/common/CancelButton";
import CloseButton from "@/components/common/CloseButton";
import SaveButton from "@/components/common/SaveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { useNoScroll } from "@/hooks/useNoScroll";
import { MapPin, Users, Bed, Info, DollarSign, Sparkles } from "lucide-react";
import BadgeButton from "@/components/common/BadgeButton";
import BadgeItem from "@/components/common/BadgeItem";

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
  useNoScroll(isOpen);
  if (!isOpen || !room) return null;

  const status = statusMap[room.status] ?? statusMap[Object.keys(statusMap)[0]];
  const beds = room.roomBeds || [];
  const capacity = room.roomType?.maxOccupancy ?? room.capacity ?? 0;
  const price = room.pricePlan?.basePrice ?? room.roomType?.basePrice;
  const amenities = room.roomTypeAmenities || [];
  const coverImage =
    room.roomImages?.find((img) => img.isCover)?.url ??
    room.roomImages?.[0]?.url ??
    null;

  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category || "other";
    (acc[cat] = acc[cat] || []).push(a);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-[8px] overflow-hidden border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md">
        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        <div className="relative p-8 flex flex-col gap-5 overflow-y-auto max-h-[90vh]">
          {/* Cover image */}
          {coverImage && (
            <div className="w-full h-48 rounded-[6px] overflow-hidden -mx-0 mb-1">
              <img
                src={coverImage}
                alt={room.roomNumber}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Room badge */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <div
              className="w-16 h-16 rounded-[6px] border flex items-center justify-center font-mono"
              style={{
                background: status.bg,
                borderColor: status.border,
              }}
            >
              <span
                className="text-2xl font-semibold"
                style={{ color: status.text }}
              >
                {room.roomNumber}
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Thông tin chi tiết
            </p>
            <span
              className="px-2.5 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider border"
              style={{
                background: status.bg,
                color: status.text,
                borderColor: status.border,
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
          <div className="p-3.5 rounded-[6px] border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-zinc-500 mb-2.5">
              <Bed size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Loại giường
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {beds.length > 0 ? (
                beds.map((bed, i) => (
                  <BadgeItem
                    key={i}
                    label={`${bed.roomBedType ?? bed.roomBedType} · ${bed.quantity}`}
                  />
                ))
              ) : (
                <span className="text-xs text-zinc-500">Chưa có thông tin</span>
              )}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="p-3.5 rounded-[6px] border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-zinc-500 mb-2.5">
                <Sparkles size={12} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Tiện nghi
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((a) => (
                        <BadgeButton
                          key={a.roomAmenityId}
                          label={a.roomAmenityName}
                          active={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-[6px] bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Giá
              </p>
              <p className="text-lg font-semibold font-mono text-violet-300">
                {formatVND(price)}
              </p>
            </div>
            <DollarSign size={24} className="text-zinc-600" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <CloseButton onClose={onClose} label="Đóng" />
            <SaveButton label={"Chỉnh sửa"} onSave={() => onEdit(room)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="p-3 rounded-[6px] border border-white/[0.06] bg-white/[0.02]">
    <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5">
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className="text-xs font-medium text-zinc-300 font-mono ml-[19px]">
      {value}
    </p>
  </div>
);

export default RoomDetailModal;
