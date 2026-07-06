import BadgeButton from "@/components/common/BadgeButton";

const CATEGORY_LABEL = {
  bathroom: "Phòng tắm",
  bedroom: "Phòng ngủ",
  kitchen: "Bếp",
  living: "Phòng khách",
  entertainment: "Giải trí",
  service: "Dịch vụ",
  outdoor: "Ngoài trời",
};

const StepAmenities = ({ amenities, selectedIds, onToggle }) => {
  const grouped = amenities.reduce((acc, a) => {
    const cat = a.category || "other";
    (acc[cat] = acc[cat] || []).push(a);
    return acc;
  }, {});

  if (amenities.length === 0) {
    return (
      <p className="text-xs text-zinc-500 text-center py-4">
        Không có tiện nghi nào.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            {CATEGORY_LABEL[cat] ?? cat}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {items.map((a) => {
              const active = selectedIds.includes(a.roomAmenityId);
              return (
                <BadgeButton
                  key={a.roomAmenityId}
                  onClick={() => onToggle(a.roomAmenityId)}
                  label={a.roomAmenityName}
                  active={active}
                />
              );
            })}
          </div>
        </div>
      ))}

      {selectedIds.length > 0 && (
        <p className="text-xs text-violet-400 font-medium font-mono">
          Đã chọn {selectedIds.length} tiện nghi
        </p>
      )}
    </div>
  );
};

export default StepAmenities;
