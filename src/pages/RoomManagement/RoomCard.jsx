import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Tag, Eye } from "lucide-react";

const RoomCard = ({ room, onView, onEdit, onDelete, statusMap }) => {
  const status = statusMap[room.status] ?? statusMap[Object.keys(statusMap)[0]];

  const beds = room.roomBeds || [];
  const capacity = room.roomType?.maxOccupancy ?? room.capacity ?? 0;
  const price = room.pricePlan?.basePrice ?? room.roomType?.basePrice;
  const coverImage =
    room.roomImages?.find((img) => img.isCover)?.url ??
    room.roomImages?.[0]?.url ??
    null;

  return (
    <div
      onClick={() => onView(room)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[240px] rounded-[8px] p-5 transition-all duration-200 hover:-translate-y-0.5 bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] hover:border-violet-500/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
    >
      {/* Status accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[8px]"
        style={{ backgroundColor: status.color }}
      />

      {/* Cover image */}
      {coverImage && (
        <div className="absolute inset-0 rounded-[8px] overflow-hidden pointer-events-none">
          <img
            src={coverImage}
            alt={room.roomNumber}
            className="w-full h-full object-cover opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-200"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">
            Phòng
          </p>
          <h4 className="text-2xl font-semibold leading-none font-mono text-[#f5f0ff] group-hover:text-violet-400 transition-colors">
            {room.roomNumber}
          </h4>
        </div>
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

      {/* Room type */}
      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 mb-3">
        <Tag size={11} className="text-violet-400 shrink-0" />
        {room.roomType?.typeName || "—"}
      </p>

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start font-mono">
        {beds.length > 0 ? (
          beds.map((bed, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs font-medium text-zinc-400 border border-white/[0.04] bg-white/[0.02]"
            >
              <Bed size={10} className="text-zinc-500 shrink-0" />
              {bed.quantity} {bed.roomBedType}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs text-zinc-500 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} />
            Chưa có
          </span>
        )}

        {capacity > 0 && (
          <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-zinc-400">
            <Users size={10} />
            {capacity}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Giá phòng
        </p>
        <p className="text-base font-semibold font-mono text-violet-300 mt-0.5">
          {formatVND(price)}
        </p>
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
              onEdit(room);
            }}
          />
          <RemoveButton
            onRemove={(e) => {
              e.stopPropagation();
              onDelete(room);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
