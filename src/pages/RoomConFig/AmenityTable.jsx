import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { useSidebar } from "@/components/ui/sidebar";
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
  const { open } = useSidebar();

  if (amenities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-600 select-none">
        <Sparkles size={28} className="mb-2 opacity-30" />
        <p className="text-xs font-semibold">Chưa có tiện ích nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden select-none bg-[#120d1e]/45 backdrop-blur-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <div className={`${open ? "md:min-w-2xl" : ""} lg:min-w-4xl`}>
          {/* Header */}
          <div className="grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01]">
            {["#", "Tên tiện ích", "Danh mục", "Thao tác"].map((h, i) => (
              <p
                key={i}
                className={`text-[10px] font-semibold text-zinc-500 tracking-wider uppercase ${
                  i === 3 ? "text-right" : ""
                }`}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {amenities.map((amenity, i) => (
            <div
              key={amenity.roomAmenityId}
              className={`grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] cursor-pointer ${
                i !== amenities.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <p className="text-xs text-zinc-500 font-mono">{i + 1}</p>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Sparkles size={12} className="text-violet-400" />
                </div>
                <p className="text-sm font-medium text-zinc-200">
                  {amenity.roomAmenityName}
                </p>
              </div>

              <div>
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider border ${
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
      </div>
    </div>
  );
};

export default AmenityTable;
