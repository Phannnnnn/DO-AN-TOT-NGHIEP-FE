import AddButton from "@/components/common/AddButton";
import SearchPrimary from "@/components/common/SearchPrimary";

const RoomMangagementHeader = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  fillterMap = {},
  onAddItem,
  addButtonLabel = "Thêm mới",
  searchPlaceholder = "Tìm kiếm...",
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 sticky top-0 z-30 bg-[#120d1e]/90 backdrop-blur-md px-4 py-3 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
      <div className={`flex flex-col lg:flex-row gap-3`}>
        <SearchPrimary
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={searchPlaceholder}
        />

        {/* Filter pills */}
        <div className="flex gap-1 md:gap-2 flex-wrap">
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
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium cursor-pointer transition-all duration-200 border ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                    : "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-zinc-400"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <AddButton onAddItem={onAddItem} addLabel={addButtonLabel} />
      </div>
    </div>
  );
};

export default RoomMangagementHeader;
