import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { Bed } from "lucide-react";

const BedTypeTable = ({ bedTypes, onEdit, onDelete }) => {
  if (bedTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-600 select-none">
        <Bed size={28} className="mb-2 opacity-30" />
        <p className="text-xs font-semibold">Chưa có loại giường nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden select-none bg-[#120d1e]/45 backdrop-blur-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-xl">
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.01]">
            {["#", "Tên loại giường", "Sức chứa", "Thao tác"].map((h, i) => (
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
          {bedTypes.map((bed, i) => (
            <div
              key={bed.roomBedId}
              className={`grid grid-cols-[2rem_1fr_8rem_10rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] cursor-pointer ${
                i !== bedTypes.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}
            >
              <p className="text-xs text-zinc-500 font-mono">{i + 1}</p>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Bed size={13} className="text-violet-400" />
                </div>
                <p className="text-sm font-medium text-zinc-200">
                  {bed.roomBedType}
                </p>
              </div>

              <div>
                <span className="px-2 py-0.5 rounded-[4px] text-xs font-medium border bg-white/[0.04] border-white/[0.08] text-zinc-400 font-mono">
                  {bed.capacity ?? 1} người
                </span>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <EditButton onEdit={() => onEdit(bed)} />
                <RemoveButton onRemove={() => onDelete(bed)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BedTypeTable;
