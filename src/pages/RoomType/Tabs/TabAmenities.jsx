import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";
import { roomAmenityService } from "@/services/roomAmenity/roomAmenityService";

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  kitchen: "Bếp",
  living: "Phòng khách",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  outdoor: "Ngoài trời",
  other: "Khác",
};

// Map màu sang class Tailwind để tối ưu hiệu năng
const CATEGORY_STYLE = {
  bathroom: "bg-blue-500/15 border-blue-500/35",
  bedroom: "bg-[#b026ff]/15 border-[#b026ff]/35",
  kitchen: "bg-amber-500/15 border-amber-500/35",
  living: "bg-emerald-500/15 border-emerald-500/35",
  entertainment: "bg-red-500/15 border-red-500/35",
  service: "bg-indigo-500/15 border-indigo-500/35",
  outdoor: "bg-teal-500/15 border-teal-500/35",
  other: "bg-gray-500/15 border-gray-500/35",
};

const TabAmenities = ({ allAmenities, linked, roomTypeId, onChange }) => {
  const linkedSet = new Set(linked.map((l) => l.roomAmenityId));
  const [toggling, setToggling] = useState(null);

  const handleToggle = async (amenity) => {
    const amenityId = amenity.roomAmenityId;
    if (toggling === amenityId) return;
    setToggling(amenityId);
    try {
      if (linkedSet.has(amenityId)) {
        await roomAmenityService.removeFromRoomType(roomTypeId, amenityId);
        onChange(linked.filter((l) => l.roomAmenityId !== amenityId));
        toast.success(`Đã bỏ "${amenity.roomAmenityName}".`);
      } else {
        const res = await roomAmenityService.addToRoomType(
          roomTypeId,
          amenityId,
        );
        if (res?.success) {
          onChange([...linked, res.data]);
          toast.success(`Đã thêm "${amenity.roomAmenityName}".`);
        }
      }
    } catch {
      toast.error("Thao tác thất bại!");
    } finally {
      setToggling(null);
    }
  };

  const grouped = allAmenities.reduce((acc, a) => {
    const cat = a.category || "other";
    (acc[cat] = acc[cat] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="flex w-fit items-center gap-3 px-4 py-3 rounded-xl border border-[#b026ff]/15 bg-[#b026ff]/5">
        <span className="text-xl font-black text-[#dda6ff]">
          {linkedSet.size}
        </span>
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">
          / {allAmenities.length} tiện nghi đã chọn
        </span>
      </div>

      {/* Groups */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2.5 px-1 text-gray-500">
            {CATEGORY_LABEL[cat] ?? cat}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {items.map((amenity) => {
              const amenityId = amenity.roomAmenityId; // Lưu ý: Fix lỗi typo 'roomAmentityId'
              const isLinked = linkedSet.has(amenityId);
              const isLoading = toggling === amenityId;

              return (
                <button
                  key={amenityId}
                  onClick={() => handleToggle(amenity)}
                  disabled={!!toggling}
                  className={`relative flex items-center gap-2.5 p-3.5 rounded-xl text-left transition-all border disabled:cursor-not-allowed
                    ${
                      isLinked
                        ? `${CATEGORY_STYLE[cat] || "bg-[#b026ff]/15 border-[#b026ff]/35"} text-gray-200`
                        : "border-white/[0.06] bg-white/[0.025] text-gray-600 hover:border-white/[0.12] hover:text-gray-400"
                    }`}
                >
                  {/* Checkbox indicator */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all border
                      ${
                        isLinked
                          ? "bg-[#b026ff] border-[#b026ff]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                  >
                    {isLoading ? (
                      <Loader2 size={11} className="animate-spin text-white" />
                    ) : (
                      isLinked && (
                        <Check
                          size={11}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )
                    )}
                  </div>

                  <span className="text-[12px] font-semibold leading-tight">
                    {amenity.roomAmenityName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabAmenities;
