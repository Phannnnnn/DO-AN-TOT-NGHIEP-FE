import { Search } from "lucide-react";

const SearchPrimary = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Tìm kiếm...",
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-[42px] pl-[40px] bg-[#0a0616]/75 border border-[#b026ff]/25 rounded-full text-gray-200 text-xs md:text-sm font-bold outline-none box-border transition-all"
        onFocus={(e) => {
          e.target.style.borderColor = "#00f0ff";
          e.target.style.boxShadow = "0 0 15px rgba(0, 240, 255, 0.45)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(176, 38, 255, 0.25)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};

export default SearchPrimary;
