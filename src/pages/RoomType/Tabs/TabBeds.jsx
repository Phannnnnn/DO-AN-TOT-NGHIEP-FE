import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Stepper from "@/components/common/Stepper";
import CustomSelect from "@/components/common/CustomSelect";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { roomBedService } from "@/services/roombeds/roomBedService";

const BED_TYPES = [
  { value: "single", label: "Giường Đơn" },
  { value: "double", label: "Giường Đôi" },
  { value: "king", label: "Giường King" },
  { value: "queen", label: "Giường Queen" },
  { value: "bunk", label: "Giường Tầng" },
];

const BED_LABEL = {
  single: "Đơn",
  double: "Đôi",
  king: "King",
  queen: "Queen",
  bunk: "Tầng",
};

const DEFAULT_NEW = { roomBedType: "king", quantity: 1 };

const TabBeds = ({ beds, roomTypeId, onChange }) => {
  const [newBed, setNewBed] = useState(DEFAULT_NEW);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState(null);

  const handleAdd = async () => {
    setAdding(true);
    try {
      const res = await roomBedService.create({ roomTypeId, ...newBed });
      if (res?.success) {
        onChange([...beds, res.data]);
        setNewBed(DEFAULT_NEW);
        toast.success("Thêm giường thành công.");
      }
    } catch {
      toast.error("Thêm thất bại!");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!bedToDelete) return;
    setDeletingId(bedToDelete.roomBedId);
    try {
      await roomBedService.delete(bedToDelete.roomBedId);
      onChange(beds.filter((b) => b.roomBedId !== bedToDelete.roomBedId));
      toast.success("Đã xóa giường.");
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeletingId(null);
      setBedToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Existing beds */}
      {beds.length === 0 ? (
        <div className="flex items-center justify-center py-10 rounded-2xl border border-dashed border-white/[0.08]">
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
            Chưa có giường nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {beds.map((bed) => (
            <div
              key={bed.roomBedId}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.025] group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.12em]">
                  Loại giường
                </span>
                <span className="text-sm font-black text-gray-200 capitalize">
                  {BED_LABEL[bed.roomBedType] ?? bed.roomBedType}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.1em]">
                    Số lượng
                  </span>
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-[#dda6ff]"
                    style={{
                      background: "rgba(176,38,255,0.12)",
                      border: "1px solid rgba(176,38,255,0.2)",
                    }}
                  >
                    {bed.quantity}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setBedToDelete(bed);
                    setConfirmOpen(true);
                  }}
                  disabled={deletingId === bed.roomBedId}
                  className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                >
                  {deletingId === bed.roomBedId ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new bed */}
      <div
        className="p-5 rounded-2xl border border-[rgba(176,38,255,0.1)] flex flex-col gap-4"
        style={{ background: "rgba(176,38,255,0.04)" }}
      >
        <p className="text-[9px] font-black text-[#b026ff] uppercase tracking-[0.15em]">
          Thêm giường mới
        </p>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-52">
            <CustomSelect
              label="Loại giường"
              value={newBed.roomBedType}
              onChange={(v) => setNewBed((p) => ({ ...p, roomBedType: v }))}
              options={BED_TYPES}
            />
          </div>
          <div className="w-36">
            <Stepper
              label="Số lượng"
              value={newBed.quantity}
              onChange={(v) => setNewBed((p) => ({ ...p, quantity: v }))}
              min={1}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-2 h-11 px-5 rounded-xl text-[11px] font-black uppercase tracking-wider text-white transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #b026ff, #7c3aed)",
              boxShadow: "0 4px 16px rgba(176,38,255,0.3)",
            }}
          >
            {adding ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Thêm
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setBedToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xóa giường này?"
        description={`Xóa ${BED_LABEL[bedToDelete?.roomBedType] ?? ""} × ${bedToDelete?.quantity ?? ""} khỏi loại phòng.`}
        confirmLabel="Xóa giường"
      />
    </div>
  );
};

export default TabBeds;
