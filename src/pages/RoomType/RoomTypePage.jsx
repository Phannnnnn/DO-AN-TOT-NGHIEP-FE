import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import RoomTypeHeader from "./RoomTypeHeader";
import RoomTypeFormModal from "./RoomTypeFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { roomTypeService } from "@/services/rooms/roomTypeService";
import RoomTypeCard from "./RoomTypeCard";

// ─────────────────────────────────────────────────────────────
const RoomTypePage = () => {
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.roomTypes();
      if (res.success) setRoomTypes(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // ── CRUD ─────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    console.log(data);
    try {
      let res;
      if (selectedType?.roomTypeId) {
        res = await roomTypeService.update(selectedType.roomTypeId, data);
        if (res?.success) {
          toast.success("Cập nhật loại phòng thành công.");
          setRoomTypes((prev) =>
            prev.map((t) =>
              t.roomTypeId === res.data.roomTypeId ? res.data : t,
            ),
          );
        }
      } else {
        res = await roomTypeService.create(data);
        if (res?.success) {
          toast.success("Tạo loại phòng thành công.");
          setRoomTypes((prev) => [...prev, res.data]);
        }
      }
      setIsFormOpen(false);
      setSelectedType(null);
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra!");
    }
  };

  const handleDeleteRequest = (roomType) => {
    setTypeToDelete(roomType);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!typeToDelete) return;
    try {
      await roomTypeService.delete(typeToDelete.roomTypeId);
      toast.success(`Đã xóa loại phòng "${typeToDelete.typeName}".`);
      setRoomTypes((prev) =>
        prev.filter((t) => t.roomTypeId !== typeToDelete.roomTypeId),
      );
    } catch {
      toast.error("Xóa thất bại, vui lòng thử lại!");
    } finally {
      setTypeToDelete(null);
    }
  };

  // ── Navigation ────────────────────────────────────────────
  const openAdd = () => {
    setSelectedType(null);
    setIsFormOpen(true);
  };

  const openEdit = (roomType) => {
    setSelectedType(roomType);
    setIsFormOpen(true);
  };

  // Click card → sang trang detail
  const openDetail = (roomType) => {
    navigate(`/room-type/${roomType.roomTypeId}`);
  };

  // ── Filter ────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      (roomTypes || []).filter((t) =>
        t.typeName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [roomTypes, searchQuery],
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-8 min-h-screen" style={{ background: "#0f0a19" }}>
      <RoomTypeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={openAdd}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin"
            size={32}
            style={{ color: "#b026ff" }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
            Không tìm thấy loại phòng nào
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-6 mb-4 flex items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(176,38,255,0.08)" }}
            />
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
              {filtered.length} loại phòng
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(176,38,255,0.08)" }}
            />
          </div>

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {filtered.map((roomType) => (
              <RoomTypeCard
                key={roomType.roomTypeId}
                roomType={roomType}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </>
      )}

      <RoomTypeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedType(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedType}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa loại phòng "${typeToDelete?.typeName ?? ""}"?`}
        description="Tất cả giường, ảnh, tiện nghi và bảng giá thuộc loại phòng này cũng sẽ bị xóa. Hành động không thể hoàn tác."
        confirmLabel="Xóa loại phòng"
      />
    </div>
  );
};

export default RoomTypePage;
