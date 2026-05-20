import { Info, Edit, Trash2 } from "lucide-react";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

const ServiceTable = ({ services, serviceTypes, onEdit, onDelete }) => {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-700">
        <Info size={32} className="mb-3 opacity-30" />
        <p className="text-xs font-black uppercase tracking-widest">
          Không tìm thấy dịch vụ nào
        </p>
      </div>
    );
  }

  const getTypeName = (typeId) => {
    const type = serviceTypes.find((t) => t.serviceTypeId === typeId);
    return type?.typeName ?? "—";
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="grid grid-cols-[4rem_1fr_8rem_8rem_8rem_7rem] gap-4 px-5 py-3.5 items-center border-b border-white/[0.06] bg-white/[0.02]">
        {["ID", "Tên dịch vụ", "Giá", "Đơn vị", "Loại", ""].map((h, i) => (
          <p
            key={i}
            className={`text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] ${i === 5 ? "text-right" : ""}`}
          >
            {h}
          </p>
        ))}
      </div>

      {services.map((service, i) => (
        <div
          key={service.serviceId}
          className={`grid grid-cols-[4rem_1fr_8rem_8rem_8rem_7rem] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-white/[0.02] ${
            i !== services.length - 1 ? "border-b border-white/[0.04]" : ""
          }`}
        >
          <p className="text-[11px] text-gray-700 font-bold">
            #{service.serviceId}
          </p>

          <div>
            <p className="text-[13px] font-semibold text-gray-200 truncate">
              {service.serviceName}
            </p>
            {service.description && (
              <p className="text-[10px] text-gray-600 mt-0.5 truncate max-w-[300px]">
                {service.description}
              </p>
            )}
          </div>

          <p className="text-[12px] font-bold text-[#c77dff]">
            {formatVND(parseFloat(service.price))}
          </p>

          <p className="text-[11px] text-gray-400">{service.unit || "—"}</p>

          <p className="text-[11px] text-gray-400">
            {getTypeName(service.serviceTypeId)}
          </p>

          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(service)}
              className="p-1.5 rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all cursor-pointer"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => onDelete(service)}
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

export default ServiceTable;
