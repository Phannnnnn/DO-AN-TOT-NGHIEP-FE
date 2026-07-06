import { useEffect, useState, useMemo } from "react";
import { Bed, Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useNotification } from "@/context/ContextProvider";

import BedTypeTable from "./BedTypeTable";
import AmenityTable from "./AmenityTable";
import BedTypeFormModal from "./BedTypeFormModal";
import AmenityFormModal from "./AmenityFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import AddButton from "@/components/common/AddButton";
import SearchPrimary from "@/components/common/SearchPrimary";
import LoadingSection from "@/components/common/LoadingSection";
import { roomBedService } from "@/services/roombeds/roomBedService";
import { roomAmenityService } from "@/services/roomAmenity/roomAmenityService";
import { useSidebar } from "@/components/ui/sidebar";

const TABS = [
  { key: "beds", label: "Loại giường", icon: Bed },
  { key: "amenities", label: "Tiện ích", icon: Sparkles },
];

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  view: "Tầm nhìn",
  other: "Khác",
};

const RoomConfigPage = () => {
  const { open } = useSidebar();

  const toast = useNotification();
  const [activeTab, setActiveTab] = useState("beds");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Beds state
  const [bedTypes, setBedTypes] = useState([]);
  const [bedsLoading, setBedsLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isBedFormOpen, setIsBedFormOpen] = useState(false);
  const [confirmBedOpen, setConfirmBedOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState(null);

  // Amenities state
  const [amenities, setAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [isAmenityFormOpen, setIsAmenityFormOpen] = useState(false);
  const [confirmAmenityOpen, setConfirmAmenityOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(null);

  // ── Fetch ────────────────────────────────────────────────
  const fetchBedTypes = async () => {
    setBedsLoading(true);
    try {
      const res = await roomBedService.roomBeds();
      if (res.success) setBedTypes(res.data || []);
    } finally {
      setBedsLoading(false);
    }
  };

  const fetchAmenities = async () => {
    setAmenitiesLoading(true);
    try {
      const res = await roomAmenityService.roomAmenities();
      if (res.success) setAmenities(res.data || []);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchBedTypes();
    fetchAmenities();
  }, []);

  // Reset search khi đổi tab
  useEffect(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setCategoryDropdownOpen(false);
  }, [activeTab]);

  // ── Bed CRUD ─────────────────────────────────────────────
  const handleBedSubmit = async (data) => {
    try {
      let res;
      if (selectedBed?.roomBedId) {
        res = await roomBedService.update(selectedBed.roomBedId, data);
        if (res.success) {
          setBedTypes((prev) =>
            prev.map((b) =>
              b.roomBedId === res.data.roomBedId ? res.data : b,
            ),
          );
          toast.success("Thành công", "Cập nhật loại giường thành công.");
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      } else {
        res = await roomBedService.create(data);
        if (res.success) {
          setBedTypes((prev) => [...prev, res.data]);
          toast.success("Thành công", "Thêm loại giường thành công.");
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      }
      setIsBedFormOpen(false);
      setSelectedBed(null);
    } catch (error) {
      toast.error("Lỗi", extractError(error));
    }
  };

  const handleBedDeleteConfirm = async () => {
    if (!bedToDelete) {
      return;
    }
    try {
      const res = await roomBedService.remove(bedToDelete.roomBedId);
      if (res.success) {
        setBedTypes((prev) =>
          prev.filter((bed) => bed.roomBedId !== res.data.roomBedId),
        );
        toast.success("Thành công", "Xóa loại giường thành công.");
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    } finally {
      setBedToDelete(null);
    }
  };

  // ── Amenity CRUD ─────────────────────────────────────────
  const handleAmenitySubmit = async (data) => {
    try {
      let res;
      if (selectedAmenity?.roomAmenityId) {
        res = await roomAmenityService.update(
          selectedAmenity.roomAmenityId,
          data,
        );
        if (res.success) {
          setAmenities((prev) =>
            prev.map((a) =>
              a.roomAmenityId === res.data.roomAmenityId ? res.data : a,
            ),
          );
          toast.success("Thành công", "Cập nhật tiện ích thành công.");
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      } else {
        res = await roomAmenityService.create(data);
        if (res.success) {
          setAmenities((prev) => [...prev, res.data]);
          toast.success("Thành công", "Thêm tiện ích thành công.");
        } else {
          toast.error("Lỗi", extractError(res));
          return;
        }
      }
      setIsAmenityFormOpen(false);
      setSelectedAmenity(null);
    } catch (error) {
      toast.error("Lỗi", extractError(error));
    }
  };

  const handleAmenityDeleteConfirm = async () => {
    if (!amenityToDelete) return;
    try {
      const res = await roomAmenityService.remove(
        amenityToDelete.roomAmenityId,
      );
      if (res.success) {
        setAmenities((prev) =>
          prev.filter((a) => a.roomAmenityId !== res.data.roomAmenityId),
        );
        toast.success("Thành công", "Xóa tiện ích thành công.");
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    } finally {
      setAmenityToDelete(null);
    }
  };

  // ── Filter ────────────────────────────────────────────────
  const filteredBeds = useMemo(
    () =>
      bedTypes.filter((b) =>
        b.roomBedType?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [bedTypes, searchQuery],
  );

  const filteredAmenities = useMemo(
    () =>
      amenities.filter(
        (a) =>
          a.roomAmenityName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          (categoryFilter === "all" || a.category === categoryFilter),
      ),
    [amenities, searchQuery, categoryFilter],
  );

  // ── Helper ────────────────────────────────────────────────
  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  const isLoading = activeTab === "beds" ? bedsLoading : amenitiesLoading;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 sticky top-0 z-30 bg-[#120d1e]/90 backdrop-blur-md px-4 py-3 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
        <div className={`flex flex-col lg:flex-row gap-3`}>
          <div className="">
            <SearchPrimary
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder={
                activeTab === "beds" ? "Tìm loại giường..." : "Tìm tiện ích..."
              }
            />
          </div>

          <div className="flex gap-1 md:gap-2 flex-wrap">
            {/* Tabs */}
            <div className="flex gap-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-200 border shrink-0 ${
                    activeTab === key
                      ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                      : "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-zinc-400"
                  }`}
                >
                  <Icon size={11} className="shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "amenities" && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setCategoryDropdownOpen((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-200 border shrink-0 ${
                    categoryFilter !== "all"
                      ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                      : "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-zinc-400"
                  }`}
                >
                  <SlidersHorizontal size={11} className="shrink-0" />
                  {categoryFilter === "all"
                    ? "Danh mục"
                    : CATEGORY_LABEL[categoryFilter]}
                  <ChevronDown
                    size={10}
                    className={`transition-transform shrink-0 ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[140px] rounded-[6px] border border-white/[0.08] bg-[#120d1e] shadow-[0_8px_32px_rgba(0,0,0,0.65)] overflow-hidden">
                    {[
                      { key: "all", label: "Tất cả" },
                      { key: "bathroom", label: "Phòng tắm" },
                      { key: "bedroom", label: "Phòng ngủ" },
                      { key: "entertainment", label: "Giải trí" },
                      { key: "service", label: "Dịch vụ" },
                      { key: "view", label: "Tầm nhìn" },
                      { key: "other", label: "Khác" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setCategoryFilter(key);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium cursor-pointer transition-colors ${
                          categoryFilter === key
                            ? "text-violet-300 bg-violet-500/10"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <AddButton
            onAddItem={() => {
              if (activeTab === "beds") {
                setSelectedBed(null);
                setIsBedFormOpen(true);
              } else {
                setSelectedAmenity(null);
                setIsAmenityFormOpen(true);
              }
            }}
            addLabel={
              activeTab === "beds" ? "Thêm loại giường" : "Thêm tiện ích"
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <LoadingSection />
        ) : activeTab === "beds" ? (
          <BedTypeTable
            bedTypes={filteredBeds}
            onEdit={(bed) => {
              setSelectedBed(bed);
              setIsBedFormOpen(true);
            }}
            onDelete={(bed) => {
              setBedToDelete(bed);
              setConfirmBedOpen(true);
            }}
          />
        ) : (
          <AmenityTable
            amenities={filteredAmenities}
            onEdit={(amenity) => {
              setSelectedAmenity(amenity);
              setIsAmenityFormOpen(true);
            }}
            onDelete={(amenity) => {
              setAmenityToDelete(amenity);
              setConfirmAmenityOpen(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <BedTypeFormModal
        isOpen={isBedFormOpen}
        onClose={() => {
          setIsBedFormOpen(false);
          setSelectedBed(null);
        }}
        onSubmit={handleBedSubmit}
        initialData={selectedBed}
      />

      <AmenityFormModal
        isOpen={isAmenityFormOpen}
        onClose={() => {
          setIsAmenityFormOpen(false);
          setSelectedAmenity(null);
        }}
        onSubmit={handleAmenitySubmit}
        initialData={selectedAmenity}
      />

      <ConfirmDialog
        isOpen={confirmBedOpen}
        onClose={() => {
          setConfirmBedOpen(false);
          setBedToDelete(null);
        }}
        onConfirm={handleBedDeleteConfirm}
        title={`Xóa loại giường "${bedToDelete?.roomBedType ?? ""}"?`}
        description="Hành động này không thể hoàn tác. Các loại phòng đang dùng loại giường này có thể bị ảnh hưởng."
        confirmLabel="Xóa"
      />

      <ConfirmDialog
        isOpen={confirmAmenityOpen}
        onClose={() => {
          setConfirmAmenityOpen(false);
          setAmenityToDelete(null);
        }}
        onConfirm={handleAmenityDeleteConfirm}
        title={`Xóa tiện ích "${amenityToDelete?.roomAmenityName ?? ""}"?`}
        description="Hành động này không thể hoàn tác. Các loại phòng đang dùng tiện ích này có thể bị ảnh hưởng."
        confirmLabel="Xóa"
      />
    </div>
  );
};

export default RoomConfigPage;
