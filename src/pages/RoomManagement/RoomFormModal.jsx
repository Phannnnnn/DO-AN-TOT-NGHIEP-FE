import { useState, useEffect } from "react";
import { useNoScroll } from "@/hooks/useNoScroll";
import Stepper from "@/components/common/Stepper";
import CancelButton from "@/components/common/CancelButton";
import InputFormValidator from "@/components/common/InputFormValidator";
import SaveButton from "@/components/common/SaveButton";
import CloseButton from "@/components/common/CloseButton";

const STATUS_OPTIONS = [
  { value: "available", label: "Trống" },
  { value: "occupied", label: "Đang ở" },
  { value: "cleaning", label: "Cần dọn dẹp" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "progress", label: "Đang dọn" },
];

const STATUS_COLOR = {
  available: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  occupied: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  cleaning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  maintenance: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  progress: "bg-rose-500/10 border-rose-500/20 text-rose-400",
};

const DEFAULT_FORM = {
  roomNumber: "",
  floor: 1,
  status: "available",
  roomTypeId: null,
};

const RoomFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  roomTypes = [],
}) => {
  useNoScroll(isOpen);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData?.roomId;

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      setFormData({
        roomNumber: initialData.roomNumber ?? "",
        floor: initialData.floor ?? 1,
        status: initialData.status ?? "available",
        roomTypeId:
          initialData.roomType?.roomTypeId ??
          initialData.roomTypeId ??
          roomTypes[0]?.roomTypeId ??
          null,
      });
    } else {
      setFormData({
        ...DEFAULT_FORM,
        roomTypeId: roomTypes[0]?.roomTypeId ?? null,
      });
    }
    setErrors({});
  }, [isOpen, initialData, roomTypes]);

  if (!isOpen) return null;

  const set = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.roomNumber.trim())
      e.roomNumber = "Số phòng không được để trống";
    if (formData.roomNumber.length > 10) e.roomNumber = "Tối đa 10 ký tự";
    if (!formData.floor || formData.floor < 1) e.floor = "Tầng phải ≥ 1";
    if (!formData.roomTypeId) e.roomTypeId = "Chọn loại phòng";
    return Object.keys(e).length ? e : null;
  };

  const handleSubmit = () => {
    const e = validate();
    if (e) {
      setErrors(e);
      return;
    }
    onSubmit({
      roomNumber: formData.roomNumber.trim(),
      floor: formData.floor,
      status: formData.status,
      roomTypeId: formData.roomTypeId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-[8px] border border-white/[0.08] shadow-2xl bg-[#120d1e]/95 backdrop-blur-md">
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-200">
                {isEdit ? "Cập nhật phòng" : "Thêm phòng mới"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {isEdit
                  ? `Chỉnh sửa thông tin phòng ${initialData.roomNumber}`
                  : "Điền thông tin để tạo phòng mới"}
              </p>
            </div>
            <CancelButton onClose={onClose} />
          </div>

          {/* Số phòng + Tầng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputFormValidator
              label={"Số phòng"}
              value={formData.roomNumber}
              onChange={(e) => set("roomNumber", e.target.value)}
              placeholder="VD: 101"
              error={errors.roomNumber}
            />

            <div className="flex flex-col gap-1.5">
              <Stepper
                label="Tầng"
                value={formData.floor}
                onChange={(v) => set("floor", v)}
                min={1}
                error={errors.floor}
              />
            </div>
          </div>

          {/* Loại phòng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Loại phòng <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {roomTypes.map((rt) => (
                <button
                  key={rt.roomTypeId}
                  onClick={() => set("roomTypeId", rt.roomTypeId)}
                  className={`px-2.5 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all border ${
                    formData.roomTypeId === rt.roomTypeId
                      ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-500 hover:border-white/[0.15] hover:text-zinc-400"
                  }`}
                >
                  {rt.typeName}
                </button>
              ))}
            </div>
            {errors.roomTypeId && (
              <span className="text-xs text-rose-400 font-mono">{errors.roomTypeId}</span>
            )}
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Trạng thái
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("status", opt.value)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all border ${
                    formData.status === opt.value
                      ? STATUS_COLOR[opt.value]
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-500 hover:border-white/[0.15] hover:text-zinc-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <CloseButton onClose={onClose} label="Hủy" />
            <SaveButton
              label={isEdit ? "Cập nhật" : "Tạo phòng"}
              onSave={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFormModal;
