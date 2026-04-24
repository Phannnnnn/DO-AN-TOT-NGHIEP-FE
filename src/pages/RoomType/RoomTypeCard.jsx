import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Tag, ArrowRight } from "lucide-react";

const BED_LABEL = {
  single: "Đơn",
  double: "Đôi",
  king: "King",
  queen: "Queen",
  bunk: "Tầng",
};

/**
 * RoomTypeCard
 * @param {{ roomTypeId, typeName, description, maxOccupancy, roomBeds, roomTypeAmenities, pricePlans }} roomType
 */
const RoomTypeCard = ({ roomType, onView, onEdit, onDelete }) => {
  const beds = roomType.roomBeds || [];
  const amenities = roomType.roomTypeAmenities || [];
  const plans = roomType.pricePlans || [];

  // Lấy plan active có priority cao nhất
  const activePlan = plans
    .filter((p) => p.isActive)
    .sort((a, b) => b.priority - a.priority)[0];

  return (
    <div
      onClick={() => onView(roomType)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[220px] rounded-2xl p-5 
                 transition-all duration-200 hover:-translate-y-1 
                 bg-gradient-to-br from-[#0f0a19] to-[#1a1425] 
                 border border-[#b026ff]/30 hover:border-[#b026ff]/50 
                 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(176,38,255,0.18)]"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#b026ff] to-[#7c3aed]" />

      {/* Glow blob */}
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none bg-[#b026ff] blur-[50px] opacity-20" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9px] font-black text-[var(--white)]/60 uppercase tracking-[0.15em] mb-0.5">
            Loại phòng
          </p>
          <h4 className="text-xl font-black text-[#f5f0ff] group-hover:text-violet-400 transition-colors capitalize">
            {roomType.typeName}
          </h4>
        </div>
        {/* Amenity count badge */}
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-[#b026ff]/12 border border-[#b026ff]/20 text-[#dda6ff]">
          <Tag size={9} />
          {amenities.length} tiện nghi
        </span>
      </div>

      {/* Description */}
      {roomType.description && (
        <p className="text-[11px] text-[var(--white)]/60 mb-3 line-clamp-2 leading-relaxed">
          {roomType.description}
        </p>
      )}

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start mb-3">
        {beds.length > 0 ? (
          beds.map((bed) => (
            <span
              key={bed.roomBedId}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[var(--yellow)]/60 border border-[var(--white)]/10 bg-[var(--white)]/10"
            >
              <Bed size={10} className="text-[var(--white)] shrink-0" />
              {bed.quantity} {BED_LABEL[bed.roomBedType] ?? bed.roomBedType}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-[var(--white)]/60 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} /> Chưa có giường
          </span>
        )}

        {/* Max occupancy */}
        <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#b026ff]/10 border border-[#b026ff]/20 text-[#dda6ff]">
          <Users size={10} className="text-[var(--purple)]" />
          {roomType.maxOccupancy}
        </span>
      </div>

      {/* Price */}
      <div className="pt-3.5 mt-auto border-t border-[#b026ff]/30">
        <p className="text-[9px] font-black text-[var(--white)]/60 uppercase tracking-[0.12em]">
          {activePlan ? activePlan.pricePlanName : "Chưa có giá"}
        </p>
        <p className="text-lg font-black text-[var(--purple)] mt-0.5">
          {activePlan ? formatVND(activePlan.basePrice) : "—"}
        </p>
      </div>

      {/* Footer actions */}
      <div className="mt-3 flex items-center justify-between h-9">
        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-[var(--white)]/60 group-hover:text-violet-400 transition-colors">
          <ArrowRight size={11} /> Chi tiết
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
