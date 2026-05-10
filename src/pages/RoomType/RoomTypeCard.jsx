import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Eye } from "lucide-react";

const BED_LABEL = {
  single: "Đơn",
  double: "Đôi",
  king: "King",
  queen: "Queen",
  bunk: "Tầng",
};

const RoomTypeCard = ({ roomType, onView, onEdit, onDelete }) => {
  const beds = roomType.roomBeds || [];
  const amenities = roomType.roomTypeAmenities || [];
  const plans = roomType.pricePlan || [];
  const weekdayPlan = plans.find((p) => p.type === "WEEKDAY");
  const basePrice = weekdayPlan?.basePrice ?? plans[0]?.basePrice;

  return (
    <div
      onClick={() => onView(roomType)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[240px] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[rgba(176,38,255,0.15)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-[rgba(176,38,255,0.45)] hover:shadow-[0_8px_32px_rgba(176,38,255,0.18)]"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#b026ff] to-[#7c3aed]" />

      {/* Glow blob */}
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none bg-[#b026ff] blur-[50px] opacity-20" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.15em] mb-0.5">
            Loại phòng
          </p>
          <h4 className="text-[1.1rem] font-black leading-tight text-[#f5f0ff] group-hover:text-violet-400 transition-colors truncate">
            {roomType.typeName}
          </h4>
        </div>
        {roomType.maxOccupancy > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
            <Users size={10} />
            {roomType.maxOccupancy}
          </span>
        )}
      </div>

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start">
        {beds.length > 0 ? (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-yellow-400/60 border border-white/10 bg-white/10">
            <Bed size={10} className="text-white/60 shrink-0" />
            {beds.length}
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/40 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} />
            Chưa có giường
          </span>
        )}
      </div>

      {/* Amenities count */}
      {amenities.length > 0 && (
        <p className="mt-2 text-[10px] text-white/40">
          {amenities.length} tiện nghi
        </p>
      )}

      {/* Price */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
        <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.12em]">
          Giá
        </p>
        <p className="text-[1.15rem] font-black text-[#c77dff] mt-0.5">
          {basePrice ? formatVND(parseFloat(basePrice)) : "Chưa có giá"}
        </p>
        {plans.length > 1 ? (
          <p className="text-[9px] text-white/40 mt-0.5">
            +{plans.length - 1} bảng giá khác
          </p>
        ) : (
          <p className="text-[9px] text-white/40 mt-0.5">
            Chưa có bảng giá khác
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between h-9">
        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-white/60 group-hover:text-violet-400 transition-colors">
          <Eye size={11} /> Chi tiết
        </span>
        <div className="flex gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          <EditButton
            onEdit={(e) => {
              e.stopPropagation();
              onEdit(roomType);
            }}
          />
          <RemoveButton
            onRemove={(e) => {
              e.stopPropagation();
              onDelete(roomType);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomTypeCard;
