import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import RoomTypeCard from "./RoomTypeCard";
import RoomTypeDetailModal from "./RoomTypeDetailModal";
import RoomTypeFormModal from "./RoomTypeFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import RoomMangagementHeader from "../RoomManagement/RoomMangagementHeader";
import { roomTypeService } from "@/services";
import { roomAmenityService } from "@/services/roomAmenity/roomAmenityService";
import { roomBedService } from "@/services/roombeds/roomBedService";

const RoomTypeManagementPage = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bedTypes, setBedTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.roomTypes();
      if (res.success) setRoomTypes(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const res = await roomAmenityService.roomAmenities();
      if (res.success) setAmenities(res.data);
    } catch {}
  };

  const fetchRoomBedTypes = async () => {
    const res = await roomBedService.roomBeds();
    if (res.success) setBedTypes(res.data);
  };

  useEffect(() => {
    fetchRoomTypes();
    fetchAmenities();
    fetchRoomBedTypes();
  }, []);

  // ── CRUD ─────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    try {
      let res;

      if (selectedRoomType?.roomTypeId) {
        res = await roomTypeService.update(selectedRoomType.roomTypeId, data);
        if (res.success) {
          setRoomTypes((prev) =>
            prev.map((roomType) =>
              roomType.roomTypeId === res.data.roomTypeId ? res.data : roomType,
            ),
          );
          toast.success("Cập nhật thành công.");
        }
      } else {
        res = await roomTypeService.create(data);
        if (res.success) {
          setRoomTypes((prev) => {
            return [...prev, res.data];
          });
          toast.success("Thêm thành công.");
        }
      }
      setIsFormOpen(false);
      setSelectedRoomType(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRequest = (roomType) => {
    setRoomTypeToDelete(roomType);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomTypeToDelete) return;
    try {
      const res = await roomTypeService.remove(roomTypeToDelete.roomTypeId);

      console.log(res);
      if (res.success) {
        setRoomTypes((prev) =>
          prev.filter(
            (roomType) => roomType.roomTypeId !== res.data.roomTypeId,
          ),
        );
        toast.success("Xóa thành công.");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRoomTypeToDelete(null);
    }
  };
  // ── Navigation ───────────────────────────────────────────
  const openAdd = () => {
    setSelectedRoomType(null);
    setIsFormOpen(true);
  };
  const openEdit = (roomType) => {
    setSelectedRoomType(roomType);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };
  const openDetail = (roomType) => {
    setSelectedRoomType(roomType);
    setIsDetailOpen(true);
  };

  // ── Filter ────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      roomTypes.filter((rt) =>
        rt.typeName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [roomTypes, searchQuery],
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      <RoomMangagementHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter="all"
        setActiveFilter={() => {}}
        fillterMap={{}}
        onAddItem={openAdd}
        addButtonLabel={"Thêm mới loại phòng"}
        searchPlaceholder={"Tìm loại phòng..."}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#b026ff]" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
            Không tìm thấy loại phòng nào
          </p>
        </div>
      ) : (
        <div
          className="mt-8 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {filtered.map((rt) => (
            <RoomTypeCard
              key={rt.roomTypeId}
              roomType={rt}
              onView={openDetail}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <RoomTypeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedRoomType(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedRoomType}
        amenities={amenities}
        bedTypes={bedTypes}
      />

      <RoomTypeDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRoomType(null);
        }}
        roomType={selectedRoomType}
        onEdit={openEdit}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setRoomTypeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa loại phòng "${roomTypeToDelete?.typeName ?? ""}"?`}
        description="Hành động này không thể hoàn tác. Các phòng thuộc loại này có thể bị ảnh hưởng."
        confirmLabel="Xóa loại phòng"
      />
    </div>
  );
};

export default RoomTypeManagementPage;
