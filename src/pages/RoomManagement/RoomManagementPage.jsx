import { useEffect, useState, useMemo } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import RoomFormModal from "./RoomFormModal";
import RoomDetailModal from "./RoomDetailModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import RoomCard from "@/pages/RoomManagement/RoomCard";
import { roomService } from "@/services";
import { roomTypeService } from "@/services/rooms/roomTypeService";
import ManagerHeader from "./RoomHeader";

const STATUS_MAP = {
  available: {
    label: "Trống",
    accent: "linear-gradient(90deg, #10b981, #059669)",
    glow: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    text: "#34d399",
    border: "rgba(16,185,129,0.3)",
  },
  occupied: {
    label: "Đang ở",
    accent: "linear-gradient(90deg, #3b82f6, #2563eb)",
    glow: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    text: "#60a5fa",
    border: "rgba(59,130,246,0.3)",
  },
  cleaning: {
    label: "Dọn dẹp",
    accent: "linear-gradient(90deg, #f59e0b, #d97706)",
    glow: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    text: "#fbbf24",
    border: "rgba(245,158,11,0.3)",
  },
  maintenance: {
    label: "Bảo trì",
    accent: "linear-gradient(90deg, #6b7280, #4b5563)",
    glow: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    text: "#9ca3af",
    border: "rgba(107,114,128,0.3)",
  },
};

// ─────────────────────────────────────────────────────────────
const RoomManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal states
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirm delete dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.rooms();
      if (res.success) setRooms(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await roomTypeService.roomTypes();
      if (res.success) setRoomTypes(res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  // ── CRUD ─────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    try {
      let res;
      if (selectedRoom?.roomId) {
        res = await roomService.update(selectedRoom.roomId, data);
        if (res?.success) {
          toast.success("Cập nhật thành công.");
          setRooms((prev) =>
            prev.map((r) => (r.roomId === res.data.roomId ? res.data : r)),
          );
        }
      } else {
        res = await roomService.create(data);
        if (res?.success) {
          toast.success("Tạo phòng thành công.");
          setRooms((prev) => [...prev, res.data]);
        }
      }
      setIsFormOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // RoomCard gọi onDelete(room) — mở dialog
  const handleDeleteRequest = (room) => {
    setRoomToDelete(room);
    setConfirmOpen(true);
  };

  // Dialog xác nhận → thực sự xóa
  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      await roomService.remove(roomToDelete.roomId);
      toast.success(`Xóa thành công.`);
      setRooms((prev) =>
        prev.filter((room) => room.roomId !== roomToDelete.roomId),
      );
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRoomToDelete(null);
    }
  };

  // ── Navigation helpers ───────────────────────────────────
  const openAdd = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  const openEdit = (room) => {
    setSelectedRoom(room);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const openDetail = (room) => {
    setSelectedRoom(room);
    setIsDetailOpen(true);
  };

  // ── Filter + group ────────────────────────────────────────
  const groupedRooms = useMemo(() => {
    const filtered = (rooms || []).filter(
      (r) =>
        r.roomNumber?.toString().includes(searchQuery) &&
        (activeFilter === "all" || r.status === activeFilter),
    );
    return filtered.reduce((acc, r) => {
      const floor = r.floor || "Khác";
      (acc[floor] = acc[floor] || []).push(r);
      return acc;
    }, {});
  }, [rooms, searchQuery, activeFilter]);

  // ── Render ────────────────────────────────────────────────
  return (
    <div
      className="p-8 max-w-[1600px] mx-auto min-h-screen"
      style={{ background: "#0f0a19" }}
    >
      <ManagerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        fillterMap={STATUS_MAP}
        onAddItem={openAdd}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin"
            size={32}
            style={{ color: "#b026ff" }}
          />
        </div>
      ) : Object.keys(groupedRooms).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
            Không tìm thấy phòng nào
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {Object.keys(groupedRooms)
            .sort((a, b) => Number(a) - Number(b))
            .map((floor) => (
              <div key={floor}>
                {/* Floor divider */}
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={13} style={{ color: "#b026ff" }} />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.15em]">
                    Tầng {floor}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(176,38,255,0.1)" }}
                  />
                  <span className="text-[10px] font-bold text-gray-700">
                    {groupedRooms[floor].length} phòng
                  </span>
                </div>

                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(210px, 1fr))",
                  }}
                >
                  {groupedRooms[floor].map((room) => (
                    <RoomCard
                      key={room.roomId}
                      room={room}
                      statusMap={STATUS_MAP}
   
                      onView={openDetail}
                      onEdit={openEdit}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modals */}
      <RoomFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedRoom}
        roomTypes={roomTypes}
      />

      <RoomDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        statusMap={STATUS_MAP}
        onEdit={openEdit}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setRoomToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa phòng ${roomToDelete?.roomNumber ?? ""}?`}
        description="Hành động này không thể hoàn tác. Toàn bộ dữ liệu của phòng sẽ bị xóa vĩnh viễn."
        confirmLabel="Xóa phòng"
      />
    </div>
  );
};

export default RoomManagementPage;
