import { useState, useEffect } from "react";
import { Save, ChevronRight, ChevronLeft } from "lucide-react";

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

const DEFAULT_IMAGE = { url: "", altText: null, isCover: false };

// ─────────────────────────────────────────────────────────────
const RoomTypeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  amenities = [],
  bedTypes = [],
}) => {
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
          altText: img.altText ?? null,
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

  // ── Validation per step ──────────────────────────────────
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

  // ── Bed helpers ──────────────────────────────────────────
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

  // ── Amenity helpers ──────────────────────────────────────
  const toggleAmenity = (id) => {
    const ids = formData.amenityIds.includes(id)
      ? formData.amenityIds.filter((x) => x !== id)
      : [...formData.amenityIds, id];
    set("amenityIds", ids);
  };

  // ── Image helpers ────────────────────────────────────────
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

  // ── Plan helpers ─────────────────────────────────────────
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

  // ── Step content map ─────────────────────────────────────
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]"
      onClick={(e) => {
        // if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-[rgba(176,38,255,0.2)] bg-gradient-to-br from-[#0f0a19] to-[#1a1425] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-7 pb-0 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              {isEdit ? "Cập nhật loại phòng" : "Thêm loại phòng mới"}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {isEdit
                ? `Chỉnh sửa ${initialData.typeName}`
                : "Điền thông tin để tạo loại phòng mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        {/* Step indicator */}
        {/* Step indicator */}
        <div className="px-7 pt-5 pb-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            {STEPS.map(({ label, sub }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5"
                style={{ width: "20%" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300"
                  style={
                    i < step
                      ? {
                          background: "#10b981",
                          color: "#fff",
                          boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                        }
                      : i === step
                        ? {
                            background: "#b026ff",
                            color: "#fff",
                            boxShadow: "0 0 14px rgba(176,38,255,0.7)",
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            color: "#4b5563",
                          }
                  }
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-wider text-center"
                  style={{
                    color:
                      i === step ? "#dda6ff" : i < step ? "#10b981" : "#4b5563",
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
                background: "linear-gradient(90deg, #10b981, #b026ff)",
                boxShadow: "0 0 8px rgba(176,38,255,0.6)",
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
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Hủy
            </button>
          ) : (
            <button
              onClick={goBack}
              className="flex-1 h-11 cursor-pointer rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={14} /> Quay lại
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex-[2] h-11 cursor-pointer rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: "linear-gradient(135deg, #b026ff, #7c3aed)",
                boxShadow: "0 4px 16px rgba(176,38,255,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(176,38,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(176,38,255,0.35)";
              }}
            >
              Tiếp theo <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-[2] h-11 cursor-pointer rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: "linear-gradient(135deg, #b026ff, #7c3aed)",
                boxShadow: "0 4px 16px rgba(176,38,255,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(176,38,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(176,38,255,0.35)";
              }}
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
