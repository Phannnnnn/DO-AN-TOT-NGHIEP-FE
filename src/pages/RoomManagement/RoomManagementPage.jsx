import { useEffect, useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import LoadingSection from "@/components/common/LoadingSection";
import { useNotification } from "@/context/ContextProvider";

import RoomFormModal from "./RoomFormModal";
import RoomDetailModal from "./RoomDetailModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import RoomCard from "@/pages/RoomManagement/RoomCard";
import { roomService, roomTypeService } from "@/services";
import RoomMangagementHeader from "./RoomMangagementHeader";

const STATUS_MAP = {
  available: {
    label: "Trống",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.16)",
  },
  occupied: {
    label: "Đang ở",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.08)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.16)",
  },
  cleaning: {
    label: "Cần dọn dẹp",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.16)",
  },
  maintenance: {
    label: "Bảo trì",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.08)",
    text: "#a78bfa",
    border: "rgba(124, 58, 237, 0.16)",
  },
  progress: {
    label: "Đang dọn",
    color: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.08)",
    text: "#fb7185",
    border: "rgba(244, 63, 94, 0.16)",
  },
};

const RoomManagementPage = () => {
  const toast = useNotification();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
        if (res.success) {
          toast.success("Thành công", "Cập nhật thành công.");
          setRooms((prev) =>
            prev.map((r) => (r.roomId === res.data.roomId ? res.data : r)),
          );
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      } else {
        res = await roomService.create(data);
        if (res.success) {
          toast.success("Thành công", "Tạo phòng thành công.");
          setRooms((prev) => [...prev, res.data]);
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      }
      setIsFormOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      toast.error("Lỗi", extractError(error));
    }
  };

  const handleDeleteRequest = (room) => {
    setRoomToDelete(room);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      await roomService.remove(roomToDelete.roomId);
      toast.success("Thành công", "Xóa thành công.");
      setRooms((prev) => prev.filter((r) => r.roomId !== roomToDelete.roomId));
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    } finally {
      setRoomToDelete(null);
    }
  };

  // ── Navigation ───────────────────────────────────────────
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
    const filtered = rooms.filter(
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

  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-8">
      <RoomMangagementHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        fillterMap={STATUS_MAP}
        onAddItem={openAdd}
        addButtonLabel="Thêm phòng mới"
        searchPlaceholder="Tìm số phòng..."
      />

      {loading ? (
        <LoadingSection />
      ) : Object.keys(groupedRooms).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-xs font-medium text-zinc-500">
            Không tìm thấy phòng nào
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {Object.keys(groupedRooms)
            .sort((a, b) => Number(a) - Number(b))
            .map((floor) => (
              <div key={floor}>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={13} className="text-violet-400" />
                  <span className="text-xs font-semibold text-zinc-300 font-mono">
                    Tầng {floor}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs font-medium text-zinc-500 font-mono">
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
