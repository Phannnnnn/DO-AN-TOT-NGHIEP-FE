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
      <p className="text-[11px] text-gray-700 text-center py-4">
        Không có tiện nghi nào.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em] mb-2">
            {CATEGORY_LABEL[cat] ?? cat}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {items.map((a) => {
              const active = selectedIds.includes(a.roomAmenityId);
              return (
                <button
                  key={a.roomAmenityId}
                  onClick={() => onToggle(a.roomAmenityId)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border ${
                    active
                      ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.4)] text-[#dda6ff]"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
                  }`}
                >
                  {a.roomAmenityName}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {selectedIds.length > 0 && (
        <p className="text-[10px] text-[#b026ff] font-bold">
          Đã chọn {selectedIds.length} tiện nghi
        </p>
      )}
    </div>
  );
};

export default StepAmenities;
