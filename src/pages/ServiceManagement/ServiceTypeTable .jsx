import { Info, Edit, Trash2 } from "lucide-react";

const ServiceTypeTable = ({ types, onEdit, onDelete }) => {
  if (types.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <Info size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-black uppercase tracking-widest">
          Không tìm thấy loại dịch vụ nào
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="grid grid-cols-[4rem_1fr_1fr_7rem] gap-4 px-5 py-3.5 items-center border-b border-white/[0.06] bg-white/[0.02]">
        {["ID", "Tên loại", "Mô tả", ""].map((h, i) => (
          <p
            key={i}
            className={`text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] ${i === 3 ? "text-right" : ""}`}
          >
            {h}
          </p>
        ))}
      </div>

      {types.map((type, i) => (
        <div
          key={type.serviceTypeId}
          className={`grid grid-cols-[4rem_1fr_1fr_7rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] ${
            i !== types.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-[11px] text-gray-700 font-bold">
            #{type.serviceTypeId}
          </p>

          <div>
            <p className="text-[13px] font-semibold text-gray-200 truncate">
              {type.typeName}
            </p>
          </div>

          <p className="text-[11px] text-gray-400 truncate">
            {type.description || "Chưa có"}
          </p>

          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(type)}
              className="p-1.5 rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all cursor-pointer"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete(type)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceTypeTable;
