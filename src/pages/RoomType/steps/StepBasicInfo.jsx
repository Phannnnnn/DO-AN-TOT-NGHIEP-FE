import Stepper from "@/components/common/Stepper";

const StepBasicInfo = ({ formData, errors, set }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Tên loại phòng */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Tên loại phòng <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.typeName}
          onChange={(e) => set("typeName", e.target.value)}
          placeholder="VD: Deluxe, Standard, Suite..."
          maxLength={100}
          className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border ${
            errors.typeName
              ? "border-red-500/50 focus:border-red-500"
              : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
          }`}
        />
        {errors.typeName && (
          <span className="text-[10px] text-red-400">{errors.typeName}</span>
        )}
      </div>

      {/* Mô tả */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Mô tả
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Mô tả ngắn về loại phòng..."
          rows={3}
          className="px-3.5 py-2.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] resize-none"
        />
      </div>

      {/* Sức chứa */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          Sức chứa tối đa
        </label>
        <div className="flex">
          <Stepper
            label=""
            value={formData.maxOccupancy}
            onChange={(v) => set("maxOccupancy", v)}
            min={1}
          />
        </div>
        {errors.maxOccupancy && (
          <span className="text-[10px] text-red-400">
            {errors.maxOccupancy}
          </span>
        )}
      </div>
    </div>
  );
};

export default StepBasicInfo;
