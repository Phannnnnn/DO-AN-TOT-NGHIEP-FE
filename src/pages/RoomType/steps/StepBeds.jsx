import { Plus, Trash2 } from "lucide-react";
import Stepper from "@/components/common/Stepper";
import BadgeButton from "@/components/common/BadgeButton";

const StepBeds = ({ beds, onAdd, onRemove, onUpdate, bedTypes = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      {beds.length === 0 && (
        <p className="text-xs text-zinc-500 text-center py-4">
          Chưa có giường nào. Nhấn "+ Thêm giường" để thêm.
        </p>
      )}

      {beds.map((bed, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-[6px] border border-white/[0.06] bg-white/[0.02]"
        >
          {/* Loại giường */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Loại giường
            </label>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {bedTypes.map((type) => (
                <BadgeButton
                  key={type.roomBedId}
                  onClick={() => onUpdate(i, "roomBedId", type.roomBedId)}
                  label={type.roomBedType}
                  active={bed.roomBedId === type.roomBedId}
                />
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 flex flex-col gap-1.5">
              <Stepper
                label=""
                value={bed.quantity}
                onChange={(v) => onUpdate(i, "quantity", v)}
                min={1}
              />
            </div>

            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-[4px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0 cursor-pointer active:scale-[0.95]"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-9 rounded-[6px] border border-dashed border-white/[0.08] text-xs font-medium text-violet-400 hover:bg-violet-500/5 hover:border-violet-500/20 transition-all active:scale-[0.98] cursor-pointer"
      >
        <Plus size={13} /> Thêm giường
      </button>
    </div>
  );
};

export default StepBeds;
