import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Stepper from "@/components/common/Stepper";
import CancelButton from "@/components/common/CancelButton";

const STATUS_OPTIONS = [
  { value: "available", label: "Trống" },
  { value: "occupied", label: "Đang ở" },
  { value: "cleaning", label: "Dọn dẹp" },
  { value: "maintenance", label: "Bảo trì" },
];

const STATUS_COLOR = {
  available: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  occupied: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  cleaning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  maintenance: "bg-gray-500/10 border-gray-500/30 text-gray-400",
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
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,5,15,0.85)] backdrop-blur-[10px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-[rgba(176,38,255,0.2)] shadow-2xl bg-gradient-to-br from-[#0f0a19] to-[#1a1425]">
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
            <CancelButton onClose={onClose} />
          </div>

          {/* Số phòng + Tầng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Số phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => set("roomNumber", e.target.value)}
                placeholder="VD: 101"
                maxLength={10}
                className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border ${
                  errors.roomNumber
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                }`}
              />
              {errors.roomNumber && (
                <span className="text-[10px] text-red-400">
                  {errors.roomNumber}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
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

          {/* Loại phòng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {roomTypes.map((rt) => (
                <button
                  key={rt.roomTypeId}
                  onClick={() => set("roomTypeId", rt.roomTypeId)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border ${
                    formData.roomTypeId === rt.roomTypeId
                      ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.4)] text-[#dda6ff]"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {rt.typeName}
                </button>
              ))}
            </div>
            {errors.roomTypeId && (
              <span className="text-[10px] text-red-400">
                {errors.roomTypeId}
              </span>
            )}
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Trạng thái
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("status", opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border ${
                    formData.status === opt.value
                      ? STATUS_COLOR[opt.value]
                      : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] h-11 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
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
