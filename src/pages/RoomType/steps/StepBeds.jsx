import { Plus, Trash2 } from "lucide-react";
import Stepper from "@/components/common/Stepper";

const StepBeds = ({ beds, onAdd, onRemove, onUpdate, bedTypes = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      {beds.length === 0 && (
        <p className="text-[11px] text-gray-700 text-center py-4">
          Chưa có giường nào. Nhấn "+ Thêm giường" để thêm.
        </p>
      )}

      {beds.map((bed, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.025]"
        >
          {/* Loại giường */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Loại giường
            </label>
            <div className="flex flex-wrap gap-1.5">
              {bedTypes.map((type) => (
                <button
                  key={type.roomBedId}
                  onClick={() => onUpdate(i, "roomBedId", type.roomBedId)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border ${
                    bed.roomBedId === type.roomBedId
                      ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.4)] text-[#dda6ff]"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {type.roomBedType}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 flex flex-col gap-1.5">
              {/* <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Số lượng
              </p> */}
              <Stepper
                label=""
                value={bed.quantity}
                onChange={(v) => onUpdate(i, "quantity", v)}
                min={1}
              />
            </div>

            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-[rgba(176,38,255,0.3)] text-[11px] font-black text-[#b026ff] hover:bg-[rgba(176,38,255,0.06)] transition-colors cursor-pointer"
      >
        <Plus size={13} /> Thêm giường
      </button>
    </div>
  );
};

export default StepBeds;
