import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Eye } from "lucide-react";

const RoomTypeCard = ({ roomType, onView, onEdit, onDelete }) => {
  const beds = roomType.roomBeds || [];
  const amenities = roomType.roomTypeAmenities || [];
  const plans = roomType.pricePlan || [];

  const basePrice = plans.find((p) => p.isActive);

  return (
    <div
      onClick={() => onView(roomType)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[240px] rounded-[8px] p-5 transition-all duration-200 hover:-translate-y-0.5 bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] hover:border-violet-500/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[8px] bg-violet-600" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">
            Loại phòng
          </p>
          <h4 className="text-base font-semibold leading-tight text-[#f5f0ff] group-hover:text-violet-400 transition-colors truncate">
            {roomType.typeName}
          </h4>
        </div>
        {roomType.maxOccupancy > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium shrink-0 bg-white/[0.04] border border-white/[0.08] text-zinc-400 font-mono">
            <Users size={10} />
            {roomType.maxOccupancy}
          </span>
        )}
      </div>

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start font-mono">
        {beds.length > 0 ? (
          <span className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs font-medium text-zinc-400 border border-white/[0.06] bg-white/[0.02]">
            <Bed size={10} className="text-zinc-500 shrink-0" />
            {beds.length}
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs text-zinc-500 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} />
            Chưa có giường
          </span>
        )}
      </div>

      {/* Amenities count */}
      {amenities.length > 0 && (
        <p className="mt-2 text-xs text-zinc-500 font-mono">
          {amenities.length} tiện nghi
        </p>
      )}

      {/* Price */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Giá
        </p>
        <p className="text-base font-semibold font-mono text-violet-300 mt-0.5">
          {basePrice?.basePrice
            ? formatVND(parseFloat(basePrice.basePrice))
            : ""}
        </p>
        {plans.length > 1 ? (
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            +{plans.length - 1} bảng giá khác
          </p>
        ) : (
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Chưa có bảng giá khác
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between h-9">
        <span className="flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-violet-400 transition-colors">
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
