import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { X, Edit3, Users, Bed, Sparkles, DollarSign } from "lucide-react";

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
  WEEKDAY: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  WEEKEND: "bg-blue-500/10 border-blue-500/25 text-blue-400",
  HOLIDAY: "bg-amber-500/10 border-amber-500/25 text-amber-400",
};

const RoomTypeDetailModal = ({ roomType, isOpen, onClose, onEdit }) => {
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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.82)] backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[500px] rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(176,38,255,0.07)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425]">
        {/* Top glow */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none bg-[#b026ff] blur-[60px] opacity-20" />

        {/* Close button — fixed, tidak scroll */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-600 hover:bg-white/10 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* Scrollable content */}
        <div className="relative p-8 flex flex-col gap-5 overflow-y-auto max-h-[90vh]">
          {/* Header badge */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[rgba(176,38,255,0.12)] border border-[rgba(176,38,255,0.3)]">
              <Bed size={28} className="text-[#dda6ff]" />
            </div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
              Loại phòng
            </p>
            <h3 className="text-xl font-black text-[#f5f0ff] text-center">
              {roomType.typeName}
            </h3>
            {roomType.maxOccupancy > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
                <Users size={10} /> Tối đa {roomType.maxOccupancy} người
              </span>
            )}
          </div>

          {/* Description */}
          {roomType.description && (
            <p className="text-[12px] text-gray-500 text-center leading-relaxed -mt-2">
              {roomType.description}
            </p>
          )}

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
                    {bed.quantity}×{" "}
                    {BED_LABEL[bed.roomBedType] ?? bed.roomBedType}
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

          {/* Price plans */}
          {plans.length > 0 && (
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025]">
              <div className="flex items-center gap-1.5 text-gray-600 mb-2.5">
                <DollarSign size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                  Bảng giá
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {plans.map((plan) => {
                  const style =
                    PLAN_TYPE_STYLE[plan.type] ?? PLAN_TYPE_STYLE.WEEKDAY;
                  return (
                    <div
                      key={plan.pricePlanId}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${style}`}
                    >
                      <div>
                        <p className="text-[11px] font-bold">
                          {plan.pricePlanName}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-wider opacity-70">
                          {PLAN_TYPE_LABEL[plan.type] ?? plan.type}
                          {plan.dateFrom &&
                            ` · ${plan.dateFrom} → ${plan.dateTo}`}
                        </p>
                      </div>
                      <p className="text-[13px] font-black">
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
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => onEdit(roomType)}
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

export default RoomTypeDetailModal;
