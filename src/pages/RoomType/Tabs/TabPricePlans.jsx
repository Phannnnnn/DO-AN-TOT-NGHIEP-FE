import { useState } from "react";
import { Plus, Trash2, Edit3, Loader2, Check, Star } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatVND } from "@/types/utils/fomatters/vndFomatter";

const DEFAULT_FORM = {
  pricePlanName: "",
  basePrice: "",
  dateFrom: "",
  dateTo: "",
  priority: 0,
  isActive: true,
};

// ── Inline form (add / edit) ──────────────────────────────────
const PlanForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial ?? DEFAULT_FORM);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls =
    "h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.06)] w-full";

  return (
    <div
      className="p-5 rounded-2xl border border-[rgba(176,38,255,0.2)] flex flex-col gap-4"
      style={{ background: "rgba(176,38,255,0.05)" }}
    >
      <p className="text-[9px] font-black text-[#b026ff] uppercase tracking-[0.15em]">
        {initial?.pricePlanId ? "Chỉnh sửa bảng giá" : "Thêm bảng giá mới"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Name */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Tên bảng giá
          </label>
          <input
            type="text"
            value={form.pricePlanName}
            onChange={(e) => set("pricePlanName", e.target.value)}
            placeholder="VD: Base Price, Weekend, Holiday..."
            className={inputCls}
          />
        </div>

        {/* Base price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            value={form.basePrice}
            onChange={(e) => set("basePrice", e.target.value)}
            placeholder="500000"
            min={0}
            className={inputCls}
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Độ ưu tiên
            <span className="ml-1 text-gray-700 normal-case font-medium">
              (số càng cao càng ưu tiên)
            </span>
          </label>
          <input
            type="number"
            value={form.priority}
            onChange={(e) => set("priority", parseInt(e.target.value) || 0)}
            min={0}
            className={inputCls}
          />
        </div>

        {/* Date from */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Từ ngày{" "}
            <span className="text-gray-700 normal-case font-medium">
              (tuỳ chọn)
            </span>
          </label>
          <input
            type="date"
            value={form.dateFrom || ""}
            onChange={(e) => set("dateFrom", e.target.value || null)}
            className={inputCls + " [color-scheme:dark]"}
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            Đến ngày{" "}
            <span className="text-gray-700 normal-case font-medium">
              (tuỳ chọn)
            </span>
          </label>
          <input
            type="date"
            value={form.dateTo || ""}
            onChange={(e) => set("dateTo", e.target.value || null)}
            className={inputCls + " [color-scheme:dark]"}
          />
        </div>

        {/* isActive toggle */}
        <div className="col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("isActive", !form.isActive)}
            className={`w-10 h-6 rounded-full transition-all relative shrink-0
              ${form.isActive ? "bg-[#b026ff]" : "bg-white/[0.08]"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                ${form.isActive ? "left-5" : "left-1"}`}
            />
          </button>
          <span className="text-[11px] font-semibold text-gray-400">
            {form.isActive ? "Đang kích hoạt" : "Không kích hoạt"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.pricePlanName.trim() || !form.basePrice}
          className="flex-[2] h-10 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #b026ff, #7c3aed)",
            boxShadow: "0 4px 16px rgba(176,38,255,0.3)",
          }}
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Check size={13} />
          )}
          Lưu
        </button>
      </div>
    </div>
  );
};

// ── Main Tab ──────────────────────────────────────────────────
const TabPricePlans = ({ pricePlans, roomTypeId, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Sorted by priority desc
  const sorted = [...pricePlans].sort((a, b) => b.priority - a.priority);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const payload = {
        pricePlanName: form.pricePlanName.trim(),
        basePrice: parseFloat(form.basePrice),
        dateFrom: form.dateFrom || null,
        dateTo: form.dateTo || null,
        priority: form.priority,
        isActive: form.isActive,
        roomTypeId,
      };

      if (editingPlan?.pricePlanId) {
        const res = await pricePlanService.update(
          editingPlan.pricePlanId,
          payload,
        );
        if (res?.success) {
          onChange(
            pricePlans.map((p) =>
              p.pricePlanId === res.data.pricePlanId ? res.data : p,
            ),
          );
          toast.success("Cập nhật bảng giá thành công.");
        }
      } else {
        const res = await pricePlanService.create(payload);
        if (res?.success) {
          onChange([...pricePlans, res.data]);
          toast.success("Thêm bảng giá thành công.");
        }
      }
      setShowForm(false);
      setEditingPlan(null);
    } catch {
      toast.error("Thao tác thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      await pricePlanService.delete(planToDelete.pricePlanId);
      onChange(
        pricePlans.filter((p) => p.pricePlanId !== planToDelete.pricePlanId),
      );
      toast.success("Đã xóa bảng giá.");
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setPlanToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Plan list */}
      {sorted.length === 0 && !showForm ? (
        <div className="flex items-center justify-center py-10 rounded-2xl border border-dashed border-white/[0.08]">
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
            Chưa có bảng giá nào
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((plan) => {
            const isTopActive =
              plan.isActive &&
              plan.priority === sorted.find((p) => p.isActive)?.priority;

            // Editing this plan inline
            if (editingPlan?.pricePlanId === plan.pricePlanId) {
              return (
                <PlanForm
                  key={plan.pricePlanId}
                  initial={{
                    ...plan,
                    basePrice: plan.basePrice,
                    dateFrom: plan.dateFrom || "",
                    dateTo: plan.dateTo || "",
                  }}
                  onSave={handleSave}
                  onCancel={() => setEditingPlan(null)}
                  loading={saving}
                />
              );
            }

            return (
              <div
                key={plan.pricePlanId}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                  ${
                    plan.isActive
                      ? "border-[rgba(176,38,255,0.25)] bg-[rgba(176,38,255,0.06)]"
                      : "border-white/[0.06] bg-white/[0.025]"
                  }`}
              >
                {/* Priority badge */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                  style={{
                    background: plan.isActive
                      ? "rgba(176,38,255,0.2)"
                      : "rgba(255,255,255,0.05)",
                    color: plan.isActive ? "#dda6ff" : "#4b5563",
                  }}
                >
                  {isTopActive ? <Star size={13} /> : plan.priority}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-black text-gray-200 truncate">
                      {plan.pricePlanName}
                    </span>
                    {!plan.isActive && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-gray-600 border border-white/[0.06]">
                        Tắt
                      </span>
                    )}
                  </div>
                  {(plan.dateFrom || plan.dateTo) && (
                    <p className="text-[10px] text-gray-600">
                      {plan.dateFrom && `Từ ${plan.dateFrom}`}
                      {plan.dateFrom && plan.dateTo && " → "}
                      {plan.dateTo && `Đến ${plan.dateTo}`}
                    </p>
                  )}
                </div>

                {/* Price */}
                <span className="text-base font-black text-[#c77dff] shrink-0">
                  {formatVND(plan.basePrice)}
                </span>

                {/* Actions */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowForm(false);
                    }}
                    className="p-1.5 rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setPlanToDelete(plan);
                      setConfirmOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add form */}
      {showForm && !editingPlan && (
        <PlanForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          loading={saving}
        />
      )}

      {/* Add button */}
      {!showForm && !editingPlan && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 h-11 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border border-dashed border-[rgba(176,38,255,0.25)] text-[#b026ff] hover:bg-[rgba(176,38,255,0.08)] hover:border-[rgba(176,38,255,0.4)]"
        >
          <Plus size={14} /> Thêm bảng giá
        </button>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa "${planToDelete?.pricePlanName ?? ""}"?`}
        description="Bảng giá này sẽ bị xóa vĩnh viễn."
        confirmLabel="Xóa bảng giá"
      />
    </div>
  );
};

export default TabPricePlans;
