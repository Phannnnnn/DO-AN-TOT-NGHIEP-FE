import DateRangePicker from "@/components/common/DateRangePicker";
import InputFormValidator from "@/components/common/InputFormValidator";
import { Plus, Trash2 } from "lucide-react";

const PLAN_TYPE_OPTIONS = [
  { value: "WEEKDAY", label: "Ngày thường" },
  { value: "WEEKEND", label: "Cuối tuần" },
  { value: "HOLIDAY", label: "Lễ / Đặc biệt" },
];

const PLAN_TYPE_COLOR = {
  WEEKDAY: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  WEEKEND: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  HOLIDAY: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

// Format số nguyên sang chuỗi có dấu chấm VND
const formatPrice = (value) => {
  if (!value && value !== 0) return "";
  const num = parseInt(String(value).replace(/\D/g, ""), 10);
  return isNaN(num) ? "" : num.toLocaleString("vi-VN");
};

// Chỉ giữ lại chữ số, bỏ mọi thứ khác
const unformatPrice = (val) => val.replace(/\D/g, "");

const StepPricePlans = ({
  plans,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  isEdit,
}) => {
  const handlePriceChange = (i, e) => {
    const raw = unformatPrice(e.target.value);
    onUpdate(i, "basePrice", raw);
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {plans.length === 0 && (
        <p className="text-xs text-zinc-500 text-center py-4 font-normal">
          Chưa có bảng giá nào. Nhấn "+ Thêm bảng giá" để thêm.
        </p>
      )}

      {plans.map((plan, i) => (
        <div
          key={i}
          className="p-3.5 rounded-[6px] border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Bảng giá #{i + 1}
            </span>
            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-[4px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Tên + Loại */}
          <div className="grid grid-cols-2 gap-2 font-sans">
            <InputFormValidator
              label={"Tên kế hoạch"}
              value={plan.pricePlanName}
              onChange={(e) => onUpdate(i, "pricePlanName", e.target.value)}
              placeholder="VD: Quốc khánh"
              error={errors[`plan_name_${i}`]}
            />

            {/* Loại — pill select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Loại
              </label>
              <div className="flex flex-col gap-1">
                {PLAN_TYPE_OPTIONS.map((opt) => {
                  const locked = isEdit && !!plan.pricePlanId;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => !locked && onUpdate(i, "type", opt.value)}
                      className={`h-8 px-3 rounded-[6px] text-xs font-medium transition-all border ${
                        plan.type === opt.value
                          ? PLAN_TYPE_COLOR[opt.value]
                          : "bg-white/[0.02] border-white/[0.06] text-zinc-500"
                      } ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-white/[0.15]"}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {isEdit && plan.pricePlanId && (
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                    Không thể đổi loại khi cập nhật
                  </p>
                )}
              </div>
            </div>
          </div>

          <InputFormValidator
            label={"Giá"}
            inputMode="numeric"
            value={formatPrice(plan.basePrice)}
            onChange={(e) => handlePriceChange(i, e)}
            placeholder="VD: 1.000.000"
            error={errors[`plan_price_${i}`]}
          />

          {/* Date range — chỉ HOLIDAY */}
          {plan.type === "HOLIDAY" && (
            <DateRangePicker
              checkInDate={plan.dateFrom}
              checkOutDate={plan.dateTo}
              onChangeCheckIn={(date) => onUpdate(i, "dateFrom", date)}
              onChangeCheckOut={(date) => onUpdate(i, "dateTo", date)}
              errorCheckIn={errors[`plan_from_${i}`]}
              errorCheckOut={errors[`plan_to_${i}`]}
              labelFrom="Ngày bắt đầu"
              labelTo="Ngày kết thúc"
            />
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-9 rounded-[6px] border border-dashed border-white/[0.08] text-xs font-medium text-violet-400 hover:bg-violet-500/5 hover:border-violet-500/20 transition-all active:scale-[0.98] cursor-pointer font-sans"
      >
        <Plus size={13} /> Thêm bảng giá
      </button>
    </div>
  );
};

export default StepPricePlans;
