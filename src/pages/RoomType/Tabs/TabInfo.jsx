import { useState, useEffect } from "react";
import { Save, Users, FileText, Tag } from "lucide-react";
import Stepper from "@/components/common/Stepper";

const TabInfo = ({ roomType, onUpdate }) => {
  const [form, setForm] = useState({
    typeName: "",
    description: "",
    maxOccupancy: 1,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({
      typeName: roomType.typeName ?? "",
      description: roomType.description ?? "",
      maxOccupancy: roomType.maxOccupancy ?? 1,
    });
    setDirty(false);
    setErrors({});
  }, [roomType]);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setDirty(true);
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.typeName.trim()) e.typeName = "Tên không được để trống";
    if (form.typeName.length > 100) e.typeName = "Tối đa 100 ký tự";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await onUpdate({
        typeName: form.typeName.trim(),
        description: form.description.trim() || null,
        maxOccupancy: form.maxOccupancy,
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left — editable fields */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5 border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.025)" }}
      >
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.15em]">
          Chỉnh sửa thông tin
        </p>

        {/* Tên */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
            Tên loại phòng
          </label>
          <input
            type="text"
            value={form.typeName}
            maxLength={100}
            onChange={(e) => set("typeName", e.target.value)}
            className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-[13px] font-semibold text-gray-200 outline-none transition-all border
              ${
                errors.typeName
                  ? "border-red-500/50"
                  : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.08)]"
              }`}
          />
          {errors.typeName && (
            <span className="text-[10px] text-red-400">{errors.typeName}</span>
          )}
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
            Mô tả
          </label>
          <textarea
            value={form.description || ""}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Mô tả ngắn về loại phòng..."
            className="px-3.5 py-3 rounded-lg bg-white/[0.04] text-[13px] font-medium text-gray-200 outline-none resize-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] focus:shadow-[0_0_0_3px_rgba(176,38,255,0.08)] placeholder:text-gray-700"
          />
        </div>

        {/* Sức chứa */}
        <div className="w-44">
          <Stepper
            label="Sức chứa tối đa"
            value={form.maxOccupancy}
            onChange={(v) => set("maxOccupancy", v)}
            min={1}
          />
        </div>

        {/* Save button — chỉ hiện khi có thay đổi */}
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="self-start flex items-center gap-2 h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-wider text-white transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #b026ff, #7c3aed)",
              boxShadow: "0 4px 16px rgba(176,38,255,0.35)",
            }}
          >
            <Save size={13} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        )}
      </div>

      {/* Right — read-only summary */}
      <div className="flex flex-col gap-3">
        {[
          {
            icon: <Tag size={14} className="text-[#b026ff]" />,
            label: "ID",
            value: `#${roomType.roomTypeId}`,
          },
          {
            icon: <Users size={14} className="text-[#b026ff]" />,
            label: "Sức chứa tối đa",
            value: `${roomType.maxOccupancy} người`,
          },
          {
            icon: <FileText size={14} className="text-[#b026ff]" />,
            label: "Ngày tạo",
            value: new Date(roomType.created_At).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          },
          {
            icon: <FileText size={14} className="text-[#b026ff]" />,
            label: "Cập nhật lần cuối",
            value: new Date(roomType.update_At).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]"
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.1em]">
                {label}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabInfo;
