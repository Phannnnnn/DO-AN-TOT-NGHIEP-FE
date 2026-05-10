import { Plus, Trash2 } from "lucide-react";

const PLAN_TYPE_OPTIONS = [
  { value: "WEEKDAY", label: "Ngày thường" },
  { value: "WEEKEND", label: "Cuối tuần" },
  { value: "HOLIDAY", label: "Lễ / Đặc biệt" },
];

const PLAN_TYPE_COLOR = {
  WEEKDAY: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  WEEKEND: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  HOLIDAY: "bg-amber-500/10 border-amber-500/30 text-amber-400",
};

const StepPricePlans = ({
  plans,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  isEdit,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {plans.length === 0 && (
        <p className="text-[11px] text-gray-700 text-center py-4">
          Chưa có bảng giá nào. Nhấn "+ Thêm bảng giá" để thêm.
        </p>
      )}

      {plans.map((plan, i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.025] flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">
              Bảng giá #{i + 1}
            </span>
            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Tên + Loại */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={plan.pricePlanName}
                onChange={(e) => onUpdate(i, "pricePlanName", e.target.value)}
                placeholder="VD: Weekday"
                maxLength={100}
                className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border ${
                  errors[`plan_name_${i}`]
                    ? "border-red-500/50"
                    : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                }`}
              />
              {errors[`plan_name_${i}`] && (
                <span className="text-[10px] text-red-400">
                  {errors[`plan_name_${i}`]}
                </span>
              )}
            </div>

            {/* Loại — pill select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                Loại
              </label>
              <div className="flex flex-col gap-1">
                {PLAN_TYPE_OPTIONS.map((opt) => {
                  const locked = isEdit && !!plan.pricePlanId;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => !locked && onUpdate(i, "type", opt.value)}
                      className={`h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                        plan.type === opt.value
                          ? PLAN_TYPE_COLOR[opt.value]
                          : "bg-white/[0.03] border-white/[0.07] text-gray-600"
                      } ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.15]"}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {isEdit && plan.pricePlanId && (
                  <p className="text-[9px] text-gray-700 mt-0.5">
                    Không thể đổi loại khi cập nhật
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Giá */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={plan.basePrice}
              onChange={(e) =>
                onUpdate(i, "basePrice", e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="VD: 1000000"
              className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border ${
                errors[`plan_price_${i}`]
                  ? "border-red-500/50"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
              }`}
            />
            {errors[`plan_price_${i}`] && (
              <span className="text-[10px] text-red-400">
                {errors[`plan_price_${i}`]}
              </span>
            )}
          </div>

          {/* Date range — chỉ HOLIDAY */}
          {plan.type === "HOLIDAY" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                  Từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={plan.dateFrom}
                  onChange={(e) => onUpdate(i, "dateFrom", e.target.value)}
                  className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border ${
                    errors[`plan_from_${i}`]
                      ? "border-red-500/50"
                      : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                  }`}
                />
                {errors[`plan_from_${i}`] && (
                  <span className="text-[10px] text-red-400">
                    {errors[`plan_from_${i}`]}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
                  Đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={plan.dateTo}
                  onChange={(e) => onUpdate(i, "dateTo", e.target.value)}
                  className={`h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border ${
                    errors[`plan_to_${i}`]
                      ? "border-red-500/50"
                      : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
                  }`}
                />
                {errors[`plan_to_${i}`] && (
                  <span className="text-[10px] text-red-400">
                    {errors[`plan_to_${i}`]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-[rgba(176,38,255,0.3)] text-[11px] font-black text-[#b026ff] hover:bg-[rgba(176,38,255,0.06)] transition-colors cursor-pointer"
      >
        <Plus size={13} /> Thêm bảng giá
      </button>
    </div>
  );
};

export default StepPricePlans;
