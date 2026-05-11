import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { Sparkles } from "lucide-react";

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  view: "Tầm nhìn",
  other: "Khác",
};

const CATEGORY_COLOR = {
  bathroom: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  bedroom: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  entertainment: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  service: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  view: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  other: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

const AmenityTable = ({ amenities, onEdit, onDelete }) => {
  if (amenities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <Sparkles size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-black uppercase tracking-widest">
          Chưa có tiện ích nào
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          #
        </p>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Tên tiện ích
        </p>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Danh mục
        </p>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] text-right">
          Thao tác
        </p>
      </div>

      {/* Rows */}
      {amenities.map((amenity, i) => (
        <div
          key={amenity.roomAmenityId}
          className={`grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] ${
            i !== amenities.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-[11px] text-gray-700 font-bold">{i + 1}</p>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] flex items-center justify-center shrink-0">
              <Sparkles size={12} className="text-[#dda6ff]" />
            </div>
            <p className="text-[13px] font-semibold text-gray-200">
              {amenity.roomAmenityName}
            </p>
          </div>

          <div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                CATEGORY_COLOR[amenity.category] ?? CATEGORY_COLOR.other
              }`}
            >
              {CATEGORY_LABEL[amenity.category] ?? amenity.category}
            </span>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <EditButton onEdit={() => onEdit(amenity)} />
            <RemoveButton onRemove={() => onDelete(amenity)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmenityTable;
