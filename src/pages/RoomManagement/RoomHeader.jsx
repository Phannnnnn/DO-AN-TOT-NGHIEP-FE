import AddButton from "@/components/common/AddButton";
import SearchPrimary from "@/components/common/SearchPrimary";
import { Plus } from "lucide-react";

const ManagerHeader = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  fillterMap = [],
  onAddItem,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#0d0d1a]/85 backdrop-blur-[12px] px-5 py-4 rounded-[0.875rem] border border-violet-500/12 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex flex-wrap gap-3 items-center flex-1">
        {/* Search */}
        <SearchPrimary
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={"Tìm số phòng..."}
        />

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "Tất cả" },
            ...Object.entries(fillterMap).map(([k, v]) => ({
              key: k,
              label: v.label,
            })),
          ].map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`
  px-[14px] py-[5px] rounded-[6px] text-[10px] font-black tracking-[0.08em] 
  uppercase cursor-pointer transition-all duration-200 border
  ${
    isActive
      ? "bg-violet-500/25 text-violet-300 border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
      : "bg-white/[0.04] text-gray-500 border-white/[0.06] shadow-none"
  }
`}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "#9ca3af";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add button */}
      {onAddItem && (
        <AddButton onAddItem={onAddItem} addLabel="Thêm phòng mới" />
      )}
    </div>
  );
};

export default ManagerHeader;
