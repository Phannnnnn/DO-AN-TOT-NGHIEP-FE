import CancelButton from "@/components/common/CancelButton";
import CloseButton from "@/components/common/CloseButton";
import SaveButton from "@/components/common/SaveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Sparkles, DollarSign } from "lucide-react";
import { useNoScroll } from "@/hooks/useNoScroll";
import BadgeItem from "@/components/common/BadgeItem";

const BED_LABEL = {
  single: "Giường Đơn",
  double: "Giường Đôi",
  king: "Giường King",
  queen: "Giường Queen",
  bunk: "Giường Tầng",
};

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  kitchen: "Bếp",
  living: "Phòng khách",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  outdoor: "Ngoài trời",
};

const PLAN_TYPE_LABEL = {
  WEEKDAY: "Ngày thường",
  WEEKEND: "Cuối tuần",
  HOLIDAY: "Lễ",
};

const PLAN_TYPE_STYLE = {
  WEEKDAY: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
  WEEKEND: "bg-blue-500/10 border-blue-500/15 text-blue-400",
  HOLIDAY: "bg-amber-500/10 border-amber-500/15 text-amber-400",
};

const RoomTypeDetailModal = ({ roomType, isOpen, onClose, onEdit }) => {
  useNoScroll(isOpen);
  if (!isOpen || !roomType) return null;

  const beds = roomType.roomBeds || [];
  const amenities = roomType.roomTypeAmenities || [];
  const plans = roomType.pricePlan || [];

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
      <div className="relative w-full max-w-[500px] rounded-[8px] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md">
        <div className="absolute top-5 right-5 z-10">
          <CancelButton onClose={onClose} />
        </div>

        {/* Scrollable content */}
        <div className="relative p-8 flex flex-col gap-5 overflow-y-auto max-h-[90vh]">
          {/* Header badge */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <div className="w-16 h-16 rounded-[6px] flex items-center justify-center bg-white/[0.04] border border-white/[0.08]">
              <Bed size={28} className="text-violet-400" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Loại phòng
            </p>
            <h3 className="text-lg font-semibold text-[#f5f0ff] text-center">
              {roomType.typeName}
            </h3>
            {roomType.maxOccupancy > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-[4px] text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-zinc-400 font-mono">
                <Users size={10} /> Tối đa {roomType.maxOccupancy} người
              </span>
            )}
          </div>

          {/* Description */}
          {roomType.description && (
            <p className="text-xs text-zinc-500 text-center leading-relaxed -mt-2">
              {roomType.description}
            </p>
          )}

          {/* Beds */}
          <div className="p-3.5 rounded-[6px] border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-zinc-500 mb-2.5">
              <Bed size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Loại giường</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {beds.length > 0 ? (
                beds.map((bed, i) => (
                  <BadgeItem
                    key={i}
                    label={`${BED_LABEL[bed.roomBedType] ?? bed.roomBedType} · ${bed.quantity}`}
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
                <span className="text-[10px] font-semibold uppercase tracking-wider">Tiện nghi</span>
              </div>
              <div className="flex flex-col gap-3">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((a) => (
                        <BadgeItem
                          key={a.roomAmenityName}
                          label={a.roomAmenityName}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price plans */}
          {plans.length > 0 && (
            <div className="p-3.5 rounded-[6px] border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-zinc-500 mb-2.5">
                <DollarSign size={12} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Bảng giá</span>
              </div>
              <div className="flex flex-col gap-2">
                {plans.map((plan) => {
                  const style =
                    PLAN_TYPE_STYLE[plan.type] ?? PLAN_TYPE_STYLE.WEEKDAY;
                  return (
                    <div
                      key={plan.pricePlanId}
                      className={`${plan.isActive ? "" : "opacity-50"} flex items-center justify-between p-2.5 rounded-[4px] border ${style} font-mono`}
                    >
                      <div>
                        <p className="text-xs font-semibold">
                          {plan.pricePlanName}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {PLAN_TYPE_LABEL[plan.type] ?? plan.type}
                          {plan.dateFrom &&
                            ` · ${plan.dateFrom} → ${plan.dateTo}`}
                        </p>
                      </div>
                      <p className="text-xs font-semibold">
                        {formatVND(parseFloat(plan.basePrice))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <CloseButton onClose={onClose} label="Đóng" />
            <SaveButton label={"Chỉnh sửa"} onSave={() => onEdit(roomType)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetailModal;
