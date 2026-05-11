import EditButton from "@/components/common/EditButton";
import RemoveButton from "@/components/common/RemoveButton";
import { Bed } from "lucide-react";

const BedTypeTable = ({ bedTypes, onEdit, onDelete }) => {
  if (bedTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <Bed size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-black uppercase tracking-widest">
          Chưa có loại giường nào
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2rem_1fr_10rem] gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          #
        </p>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Tên loại giường
        </p>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] text-right">
          Thao tác
        </p>
      </div>

      {/* Rows */}
      {bedTypes.map((bed, i) => (
        <div
          key={bed.roomBedId}
          className={`grid grid-cols-[2rem_1fr_10rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] ${
            i !== bedTypes.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-[11px] text-gray-700 font-bold">{i + 1}</p>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] flex items-center justify-center shrink-0">
              <Bed size={13} className="text-[#dda6ff]" />
            </div>
            <p className="text-[13px] font-semibold text-gray-200">
              {bed.roomBedType}
            </p>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <EditButton onEdit={() => onEdit(bed)} />
            <RemoveButton onRemove={() => onDelete(bed)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BedTypeTable;
