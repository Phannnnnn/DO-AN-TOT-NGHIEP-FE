import { useState, useEffect } from "react";
import CancelButton from "@/components/common/CancelButton";
import { useNoScroll } from "@/hooks/useNoScroll";
import Stepper from "@/components/common/Stepper";
import InputFormValidator from "@/components/common/InputFormValidator";
import CloseButton from "@/components/common/CloseButton";
import SaveButton from "@/components/common/SaveButton";

const BedTypeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  useNoScroll(isOpen);
  const [roomBedType, setRoomBedType] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [errors, setErrors] = useState({});

  const isEdit = !!initialData?.roomBedId;

  useEffect(() => {
    if (!isOpen) return;
    setRoomBedType(initialData?.roomBedType ?? "");
    setCapacity(initialData?.capacity ?? 1);
    setErrors({});
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const e = {};
    if (!roomBedType.trim())
      e.roomBedType = "Tên loại giường không được để trống";
    if (roomBedType.length > 50) e.roomBedType = "Tối đa 50 ký tự";
    if (!capacity || capacity < 1) e.capacity = "Sức chứa tối thiểu là 1";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({ roomBedType: roomBedType.trim(), capacity: Number(capacity) });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-[8px] border border-white/[0.08] shadow-2xl bg-[#120d1e]/95 backdrop-blur-md">
        <div className="p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-200">
                {isEdit ? "Cập nhật loại giường" : "Thêm loại giường"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {isEdit
                  ? `Chỉnh sửa "${initialData.roomBedType}"`
                  : "Nhập thông tin loại giường mới"}
              </p>
            </div>
            <CancelButton onClose={onClose} />
          </div>

          <InputFormValidator
            label={"Tên loại giường"}
            value={roomBedType}
            onChange={(e) => {
              setRoomBedType(e.target.value);
              setErrors((p) => ({ ...p, roomBedType: undefined }));
            }}
            placeholder="VD: Giường đơn, Giường đôi..."
            error={errors.roomBedType}
          />

          {/* Sức chứa */}
          <Stepper
            label="Sức chứa (người/giường) *"
            value={capacity}
            onChange={(val) => {
              setCapacity(val);
              setErrors((p) => ({ ...p, capacity: undefined }));
            }}
            min={1}
            error={errors.capacity}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <CloseButton onClose={onClose} label="Hủy" />
            <SaveButton
              label={isEdit ? "Cập nhật" : "Thêm"}
              onSave={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedTypeFormModal;
