import { Info, Edit, Trash2 } from "lucide-react";

const ServiceTypeTable = ({ types, onEdit, onDelete }) => {
  if (types.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <Info size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-medium">Không tìm thấy loại dịch vụ nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/[0.06] overflow-hidden bg-[#120d1e]/40">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[4rem_1fr_1fr_7rem] gap-4 px-5 py-3 items-center border-b border-white/[0.06] bg-white/[0.01]">
        {["ID", "Tên loại", "Mô tả", ""].map((h, i) => (
          <p
            key={i}
            className={`text-[10px] uppercase tracking-wider font-medium text-zinc-500 ${i === 3 ? "text-right" : ""}`}
          >
            {h}
          </p>
        ))}
      </div>

      {types.map((type, i) => (
        <div
          key={type.serviceTypeId}
          className={`grid grid-cols-[4rem_1fr_1fr_7rem] gap-4 px-5 py-3 items-center transition-colors hover:bg-white/[0.02] ${
            i !== types.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-xs text-zinc-500 font-mono">
            #{type.serviceTypeId}
          </p>

          <div>
            <p className="text-sm font-medium text-zinc-200 truncate">
              {type.typeName}
            </p>
          </div>

          <p className="text-xs text-zinc-500 truncate">
            {type.description || "Chưa có"}
          </p>

          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(type)}
              className="p-1.5 rounded-[6px] border border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200 transition-all cursor-pointer active:scale-[0.95]"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete(type)}
              className="p-1.5 rounded-[6px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer active:scale-[0.95]"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeTable;
