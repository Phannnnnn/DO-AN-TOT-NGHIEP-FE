import InputFormArea from "@/components/common/InputFormArea";
import InputFormValidator from "@/components/common/InputFormValidator";
import Stepper from "@/components/common/Stepper";

const StepBasicInfo = ({ formData, errors, set }) => {
  return (
    <div className="flex flex-col gap-4">
      <InputFormValidator
        label={"Tên loại phòng"}
        value={formData.typeName}
        onChange={(e) => set("typeName", e.target.value)}
        placeholder="VD: Đơn, Đôi, VIP..."
        error={errors.typeName}
      />

      <InputFormArea
        label={"Mô tả"}
        value={formData.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Mô tả ngắn về loại phòng..."
      />

      {/* Sức chứa */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Sức chứa tối đa
        </label>
        <div className="flex">
          <Stepper
            label=""
            value={formData.maxOccupancy}
            onChange={(v) => set("maxOccupancy", v)}
            min={1}
            error={errors.maxOccupancy}
          />
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
