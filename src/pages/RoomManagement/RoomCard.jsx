import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Users, Bed, Tag, Edit3, Trash2, Eye } from "lucide-react";

const BED_LABEL = {
  single: "Đơn",
  double: "Đôi",
  king: "King",
  queen: "Queen",
  bunk: "Tầng",
};

const RoomCard = ({ room, onView, onEdit, onDelete, statusMap }) => {
  const status = statusMap[room.status] ?? statusMap[Object.keys(statusMap)[0]];

  const getRoomTypeName = (type) => {
    const name = type?.typeName?.toLowerCase() || "";
    if (name.includes("standard")) return "Tiêu Chuẩn";
    if (name.includes("deluxe")) return "Cao Cấp";
    if (name.includes("suite")) return "Hạng Sang";
    if (name.includes("family")) return "Gia Đình";
    return type?.typeName || "Khách Sạn";
  };

  const beds = room.roomBeds || [];
  const capacity = room.roomType?.maxOccupancy ?? room.capacity ?? 0;
  const price = room.pricePlans?.basePrice ?? room.roomType?.basePrice;

  return (
    <div
      onClick={() => onView(room)}
      className="relative cursor-pointer group overflow-hidden flex flex-col min-h-[240px] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg, #0f0a19, #1a1425)",
        border: "1px solid rgba(176,38,255,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid rgba(176,38,255,0.45)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(176,38,255,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(176,38,255,0.15)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
      }}
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

      {/* Header: room number + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9px] font-black text-[var(--white)]/60 uppercase tracking-[0.15em] mb-0.5">
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
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--white)]/90 mb-3">
        <Tag size={11} className="text-[var(--high-purple)] shrink-0" />
        {getRoomTypeName(room.roomType)}
      </p>

      {/* Beds */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start">
        {beds.length > 0 ? (
          beds.map((bed, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[var(--yellow)]/60 border border-[var(--white)]/10 bg-[var(--white)]/10"
            >
              <Bed size={10} className="text-[var(--white)]/60 shrink-0" />
              {bed.quantity} {BED_LABEL[bed.roomBedType] ?? bed.roomBedType}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-[var(--white)]/60 border border-white/[0.04] bg-white/[0.02]">
            <Bed size={10} />
            Chưa có
          </span>
        )}

        {capacity > 0 && (
          <span
            className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black"
            style={{
              background: "rgba(176,38,255,0.1)",
              border: "1px solid rgba(176,38,255,0.2)",
              color: "#dda6ff",
            }}
          >
            <Users size={10} className="text-[var(--purple)]" />
            {capacity}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05]">
        <p className="text-[9px] font-black text-[var(--white)]/60 uppercase tracking-[0.12em]">
          Giá phòng
        </p>
        <p className="text-[1.15rem] font-black text-[var(--purple)] mt-0.5">
          {formatVND(price)}
        </p>
      </div>

      {/* Footer actions */}
      <div className="mt-3 flex items-center justify-between h-9">
        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-[var(--white)]/60 group-hover:text-violet-400 transition-colors">
          <Eye size={11} /> Chi tiết
        </span>

        {/* Edit + Delete — slide in on hover */}
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
