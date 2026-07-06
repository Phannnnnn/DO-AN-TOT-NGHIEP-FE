import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import CancelButton from "@/components/common/CancelButton";
import SelectField from "@/components/common/SelectField";
import { useNoScroll } from "@/hooks/useNoScroll";
import ActiveButton from "@/components/common/ActiveButton";

const formatPrice = (value) => {
  if (!value && value !== 0) return "";
  const num = parseInt(String(value), 10);
  return isNaN(num) ? "" : num.toLocaleString("vi-VN");
};
const unformatPrice = (val) => val.replace(/\D/g, "");

const ServiceFormModal = ({
  isOpen,
  initialData,
  serviceTypes,
  onClose,
  onSubmit,
}) => {
  useNoScroll(isOpen);
  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    unit: "",
    isActive: true,
    description: "",
    serviceTypeId: "",
  });
  const [displayPrice, setDisplayPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  console.log(formData);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const rawPrice = initialData.price ?? "";
      const priceStr = String(rawPrice);
      setFormData({
        serviceName: initialData.serviceName || "",
        price: priceStr,
        unit: initialData.unit || "",
        isActive: initialData.isActive || false,
        description: initialData.description || "",
        serviceTypeId: initialData.serviceTypeId ?? "",
      });
      setDisplayPrice(formatPrice(priceStr));
    } else {
      setFormData({
        serviceName: "",
        price: "",
        unit: "",
        isActive: true,
        description: "",
        serviceTypeId: "",
      });
      setDisplayPrice("");
    }
    setErrors({});
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePriceChange = (e) => {
    const numericValue = unformatPrice(e.target.value);
    handleChange("price", numericValue);
    setDisplayPrice(formatPrice(numericValue));
  };

  const validate = () => {
    const errs = {};
    if (!formData.serviceName.trim())
      errs.serviceName = "Tên dịch vụ không được để trống";
    const priceNum = Number(formData.price);
    if (
      !formData.price ||
      isNaN(priceNum) ||
      priceNum < 0 ||
      !Number.isInteger(priceNum)
    )
      errs.price = "Giá không hợp lệ (phải là số nguyên dương)";
    if (!formData.serviceTypeId)
      errs.serviceTypeId = "Vui lòng chọn loại dịch vụ";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      serviceName: formData.serviceName.trim(),
      price: Number(formData.price),
      unit: formData.unit.trim() || undefined,
      isActive: formData.isActive || false,
      description: formData.description.trim() || undefined,
      serviceTypeId: Number(formData.serviceTypeId),
    };

    setLoading(true);
    // Gọi onSubmit – page sẽ tự đóng nếu thành công, nếu lỗi vẫn mở
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050308]/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] bg-[#120d1e]/95 backdrop-blur-md flex flex-col max-h-[90vh]">
        <div className="p-5 pb-4 flex items-start justify-between shrink-0 border-b border-white/[0.05]">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              {initialData ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {initialData ? "Cập nhật thông tin dịch vụ" : "Tạo dịch vụ mới"}
            </p>
          </div>
          <CancelButton onClose={onClose} />
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">
              Tên dịch vụ <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) => handleChange("serviceName", e.target.value)}
              placeholder="Nhập tên dịch vụ"
              className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                errors.serviceName
                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                  : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
              }`}
            />
            {errors.serviceName && (
              <span className="text-xs text-red-400">{errors.serviceName}</span>
            )}
          </div>

          <SelectField
            label="Loại dịch vụ *"
            value={formData.serviceTypeId}
            onChange={(e) => handleChange("serviceTypeId", e.target.value)}
            placeholder="Chọn loại..."
            options={serviceTypes.map((type) => ({
              value: type.serviceTypeId,
              label: type.typeName,
            }))}
            error={errors.serviceTypeId}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">Giá <span className="text-red-400">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                value={displayPrice}
                onChange={handlePriceChange}
                placeholder="0"
                className={`h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none transition-all border w-full ${
                  errors.price
                    ? "border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60"
                    : "border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
              />
              {errors.price && (
                <span className="text-xs text-red-400">{errors.price}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">Đơn vị</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                placeholder="vd: kg, lần, người..."
                className="h-9 px-3 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all w-full"
              />
            </div>
          </div>

          <div className="mt-1">
            <ActiveButton
              isActive={formData.isActive}
              label={"Trạng thái"}
              onChange={() => {
                handleChange("isActive", !formData.isActive);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-zinc-400">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Mô tả chi tiết dịch vụ..."
              className="px-3 py-2 rounded-[6px] bg-[#161224]/50 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all w-full resize-none"
            />
          </div>
        </div>

        <div className="p-5 pt-4 flex gap-3 shrink-0 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-[6px] text-xs font-medium text-zinc-400 border border-white/[0.08] bg-[#1a1528]/40 hover:bg-[#201a33]/60 hover:text-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-9 rounded-[6px] text-xs font-medium text-white flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Save size={14} /> {initialData ? "Cập nhật" : "Tạo dịch vụ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;
