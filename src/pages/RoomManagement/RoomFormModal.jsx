import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import Stepper from "@/components/common/Stepper";
import CustomSelect from "@/components/common/CustomSelect";

const STATUS_OPTIONS = [
  { value: "available", label: "Trống" },
  { value: "occupied", label: "Đang ở" },
  { value: "cleaning", label: "Dọn dẹp" },
  { value: "maintenance", label: "Bảo trì" },
];

const STATUS_COLORS = {
  available: "#10b981",
  occupied: "#3b82f6",
  cleaning: "#f59e0b",
  maintenance: "#6b7280",
};

const DEFAULT_FORM = {
  roomNumber: "",
  floor: 1,
  status: "available",
  roomTypeId: null,
};

// ─────────────────────────────────────────────────────────────
const RoomFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  roomTypes = [],
}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  // Build options từ API data: { roomTypeId, typeName }
  const roomTypeOptions = roomTypes.map((t) => ({
    value: String(t.roomTypeId),
    label: t.typeName,
  }));

  // Reset / populate khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    if (initialData?.roomId) {
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

  // Validation theo DTO
  const validate = () => {
    const e = {};
    if (!formData.roomNumber.trim())
      e.roomNumber = "Số phòng không được để trống";
    if (formData.roomNumber.length > 10) e.roomNumber = "Tối đa 10 ký tự";
    if (!formData.floor || formData.floor < 1) e.floor = "Tầng phải ≥ 1";
    if (!formData.roomTypeId) e.roomTypeId = "Chọn loại phòng";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    // Gửi đúng shape theo DTO
    onSubmit({
      roomNumber: formData.roomNumber.trim(),
      floor: formData.floor,
      status: formData.status,
      roomTypeId: formData.roomTypeId,
    });
  };

  const set = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const isEdit = !!initialData?.roomId;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(10px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl"
        style={{ background: "linear-gradient(145deg, #0f0a19, #1a1425)" }}
      >
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {isEdit ? "Cập nhật phòng" : "Thêm phòng mới"}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {isEdit
                  ? `Chỉnh sửa thông tin phòng ${initialData.roomNumber}`
                  : "Điền thông tin để tạo phòng mới"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-600 hover:bg-white/10 hover:text-gray-300 transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Row 1: Số phòng + Tầng */}
          <div className="grid grid-cols-2 gap-3">
            {/* Số phòng */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Số phòng
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => set("roomNumber", e.target.value)}
                placeholder="VD: 101"
                maxLength={10}
                className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all
                  border ${
                    errors.roomNumber
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.08)]"
                  }`}
              />
              {errors.roomNumber && (
                <span className="text-[10px] text-red-400">
                  {errors.roomNumber}
                </span>
              )}
            </div>

            {/* Tầng */}
            <div>
              <Stepper
                label="Tầng"
                value={formData.floor}
                onChange={(v) => set("floor", v)}
                min={1}
              />
              {errors.floor && (
                <span className="text-[10px] text-red-400 mt-1 block">
                  {errors.floor}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Loại phòng + Trạng thái */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CustomSelect
                label="Loại phòng"
                value={String(formData.roomTypeId)}
                onChange={(v) => set("roomTypeId", parseInt(v))}
                options={roomTypeOptions}
              />
              {errors.roomTypeId && (
                <span className="text-[10px] text-red-400 mt-1 block">
                  {errors.roomTypeId}
                </span>
              )}
            </div>

            <CustomSelect
              label="Trạng thái"
              value={formData.status}
              onChange={(v) => set("status", v)}
              options={STATUS_OPTIONS}
              colorMap={STATUS_COLORS}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
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
              {isEdit ? "Cập nhật" : "Tạo phòng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFormModal;
