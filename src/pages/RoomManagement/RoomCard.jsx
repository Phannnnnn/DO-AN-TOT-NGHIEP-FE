import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Tag, Eye } from "lucide-react";

const RoomCard = ({ room, onView, onEdit, onDelete, statusMap }) => {
  const status = statusMap[room.status] ?? statusMap[Object.keys(statusMap)[0]];

  const beds = room.roomBeds || [];
  const capacity = room.roomType?.maxOccupancy ?? room.capacity ?? 0;
  const price = room.pricePlan?.basePrice ?? room.roomType?.basePrice;

  return (
    <div
      onClick={() => onView(room)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[240px] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-[#0f0a19] to-[#1a1425] border border-[#b026ff]/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-[#b026ff]/45 hover:shadow-[0_8px_32px_rgba(176,38,255,0.18)]"
    >
      {/* Status accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: status.accent }}
      />

      {/* Glow blob */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: status.glow, filter: "blur(50px)", opacity: 0.35 }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.15em] mb-0.5">
            Phòng
          </p>
          <h4 className="text-[2rem] font-black leading-none text-[#f5f0ff] group-hover:text-violet-400 transition-colors">
            {room.roomNumber}
          </h4>
        </div>
        <span
          className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
          style={{
            background: status.bg,
            color: status.text,
            border: `1px solid ${status.border}`,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Room type */}
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-white/90 mb-3">
        <Tag size={11} className="text-[#b026ff] shrink-0" />
        {room.roomType?.typeName || "—"}
      </p>

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start">
        {beds.length > 0 ? (
          beds.map((bed, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-yellow-400/60 border border-white/10 bg-white/10"
            >
              <Bed size={10} className="text-white/60 shrink-0" />
              {bed.quantity} {bed.roomBedType}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/60 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} />
            Chưa có
          </span>
        )}

        {capacity > 0 && (
          <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
            <Users size={10} />
            {capacity}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
        <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.12em]">
          Giá phòng
        </p>
        <p className="text-[1.15rem] font-black text-[#c77dff] mt-0.5">
          {formatVND(price)}
        </p>
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
