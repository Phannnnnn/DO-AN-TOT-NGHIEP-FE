import { useState, useEffect } from "react";
import { Save, ChevronRight, ChevronLeft } from "lucide-react";
import { useNoScroll } from "@/hooks/useNoScroll";

import StepBasicInfo from "./steps/StepBasicInfo";
import StepBeds from "./steps/StepBeds";
import StepAmenities from "./steps/StepAmenities";
import StepImages from "./steps/StepImages";
import StepPricePlans from "./steps/StepPricePlans";
import CancelButton from "@/components/common/CancelButton";

const STEPS = [
  { label: "Thông tin" },
  { label: "Giường" },
  { label: "Tiện nghi" },
  { label: "Hình ảnh" },
  { label: "Bảng giá" },
];

const DEFAULT_FORM = {
  typeName: "",
  description: "",
  maxOccupancy: 1,
  amenityIds: [],
  roomBeds: [],
  images: [],
  pricePlans: [],
};

const DEFAULT_PLAN = {
  pricePlanName: "",
  type: "WEEKDAY",
  basePrice: "",
  dateFrom: "",
  dateTo: "",
};

const DEFAULT_IMAGE = { url: "", altText: "", isCover: false };

const RoomTypeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  amenities = [],
  bedTypes = [],
}) => {
  useNoScroll(isOpen);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData?.roomTypeId;

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setErrors({});
    if (isEdit) {
      setFormData({
        typeName: initialData.typeName ?? "",
        description: initialData.description ?? "",
        maxOccupancy: initialData.maxOccupancy ?? 1,
        amenityIds: (initialData.roomTypeAmenities || []).map(
          (a) => a.roomAmenityId,
        ),
        roomBeds: (initialData.roomBeds || []).map((b) => ({
          roomBedId: b.roomBedId,
          quantity: b.quantity,
        })),
        images: (initialData.roomImages || []).map((img) => ({
          url: img.url,
          altText: img.altText ?? "",
          isCover: img.isCover ?? false,
        })),
        pricePlans: (initialData.pricePlan || []).map((p) => ({
          pricePlanId: p.pricePlanId,
          pricePlanName: p.pricePlanName,
          type: p.type,
          basePrice: String(parseFloat(p.basePrice)),
          dateFrom: p.dateFrom ?? "",
          dateTo: p.dateTo ?? "",
        })),
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const set = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!formData.typeName.trim())
        e.typeName = "Tên loại phòng không được để trống";
      if (formData.typeName.length > 100) e.typeName = "Tối đa 100 ký tự";
      if (formData.maxOccupancy < 1) e.maxOccupancy = "Sức chứa phải ≥ 1";
    }
    if (s === 4) {
      formData.pricePlans.forEach((plan, i) => {
        if (!plan.pricePlanName.trim()) e[`plan_name_${i}`] = "Bắt buộc";
        if (
          !plan.basePrice ||
          isNaN(Number(plan.basePrice)) ||
          Number(plan.basePrice) <= 0
        )
          e[`plan_price_${i}`] = "Giá không hợp lệ";
        if (plan.type === "HOLIDAY") {
          if (!plan.dateFrom) e[`plan_from_${i}`] = "Bắt buộc";
          if (!plan.dateTo) e[`plan_to_${i}`] = "Bắt buộc";
        }
      });
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    const e = validateStep(4);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      typeName: formData.typeName.trim(),
      description: formData.description.trim() || undefined,
      maxOccupancy: formData.maxOccupancy,
      amenityIds: formData.amenityIds,
      roomBeds: formData.roomBeds.filter((b) => b.roomBedId),
      images: formData.images.filter((img) => img.url.trim()),
      pricePlans: formData.pricePlans.map((p) => ({
        ...(p.pricePlanId ? { pricePlanId: p.pricePlanId } : {}),
        pricePlanName: p.pricePlanName.trim(),
        type: p.type,
        basePrice: Number(p.basePrice),
        ...(p.type === "HOLIDAY"
          ? { dateFrom: p.dateFrom, dateTo: p.dateTo }
          : {}),
      })),
    });
  };

  const addBed = () =>
    set("roomBeds", [
      ...formData.roomBeds,
      { roomBedId: bedTypes[0]?.roomBedId ?? null, quantity: 1 },
    ]);
  const removeBed = (i) =>
    set(
      "roomBeds",
      formData.roomBeds.filter((_, idx) => idx !== i),
    );
  const updateBed = (i, key, val) =>
    set(
      "roomBeds",
      formData.roomBeds.map((b, idx) => (idx === i ? { ...b, [key]: val } : b)),
    );

  const toggleAmenity = (id) => {
    const ids = formData.amenityIds.includes(id)
      ? formData.amenityIds.filter((x) => x !== id)
      : [...formData.amenityIds, id];
    set("amenityIds", ids);
  };

  const addImage = () =>
    set("images", [...formData.images, { ...DEFAULT_IMAGE }]);
  const removeImage = (i) =>
    set(
      "images",
      formData.images.filter((_, idx) => idx !== i),
    );
  const updateImage = (i, key, val) => {
    if (key === "isCover" && val === true) {
      set(
        "images",
        formData.images.map((img, idx) => ({
          ...img,
          isCover: idx === i,
        })),
      );
    } else {
      set(
        "images",
        formData.images.map((img, idx) =>
          idx === i ? { ...img, [key]: val } : img,
        ),
      );
    }
  };

  const addPlan = () =>
    set("pricePlans", [...formData.pricePlans, { ...DEFAULT_PLAN }]);
  const removePlan = (i) =>
    set(
      "pricePlans",
      formData.pricePlans.filter((_, idx) => idx !== i),
    );
  const updatePlan = (i, key, val) => {
    set(
      "pricePlans",
      formData.pricePlans.map((p, idx) =>
        idx === i ? { ...p, [key]: val } : p,
      ),
    );
    setErrors((prev) => ({ ...prev, [`plan_${key}_${i}`]: undefined }));
  };

  const stepContent = [
    <StepBasicInfo key="basic" formData={formData} errors={errors} set={set} />,
    <StepBeds
      key="beds"
      beds={formData.roomBeds}
      onAdd={addBed}
      onRemove={removeBed}
      onUpdate={updateBed}
      bedTypes={bedTypes}
    />,
    <StepAmenities
      key="amenities"
      amenities={amenities}
      selectedIds={formData.amenityIds}
      onToggle={toggleAmenity}
    />,
    <StepImages
      key="images"
      images={formData.images}
      onAdd={addImage}
      onRemove={removeImage}
      onUpdate={updateImage}
    />,
    <StepPricePlans
      key="plans"
      plans={formData.pricePlans}
      errors={errors}
      onAdd={addPlan}
      onRemove={removePlan}
      onUpdate={updatePlan}
      isEdit={isEdit}
    />,
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {}}
    >
      <div className="w-full max-w-2xl rounded-[8px] border border-white/[0.08] bg-[#120d1e]/95 backdrop-blur-md shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-7 pb-0 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-zinc-200">
              {isEdit ? "Cập nhật loại phòng" : "Thêm loại phòng mới"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isEdit
                ? `Chỉnh sửa ${initialData.typeName}`
                : "Điền thông tin để tạo loại phòng mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Step indicator */}
        <div className="px-7 pt-5 pb-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            {STEPS.map(({ label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5"
                style={{ width: "20%" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                  style={
                    i < step
                      ? {
                          background: "#16a34a",
                          color: "#fff",
                        }
                      : i === step
                        ? {
                            background: "#7c3aed",
                            color: "#fff",
                          }
                        : {
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#71717a",
                          }
                  }
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider text-center"
                  style={{
                    color:
                      i === step ? "#c084fc" : i < step ? "#4ade80" : "#71717a",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="relative h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${(step / (STEPS.length - 1)) * 100}%`,
                background: "#7c3aed",
              }}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-7 flex-1">
          <div className="pb-2">{stepContent[step]}</div>
        </div>

        {/* Footer nav */}
        <div className="px-7 py-5 flex gap-3 shrink-0 border-t border-white/[0.05]">
          {step === 0 ? (
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer active:scale-[0.98]"
            >
              Hủy
            </button>
          ) : (
            <button
              onClick={goBack}
              className="flex-1 h-9 cursor-pointer rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ChevronLeft size={14} /> Quay lại
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex-[2] h-9 cursor-pointer rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all active:scale-[0.98]"
            >
              Tiếp theo <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-[2] h-9 cursor-pointer rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all active:scale-[0.98]"
            >
              <Save size={14} />
              {isEdit ? "Cập nhật" : "Tạo loại phòng"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomTypeFormModal;
