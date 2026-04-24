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
        className="w-full h-[42px] pl-[40px] pr-[14px] bg-white/[0.04] border border-violet-500/15 rounded-[0.625rem] text-gray-200 text-[13px] font-bold outline-none box-border focus:border-violet-500/40 transition-colors"
        onFocus={(e) => {
          e.target.style.border = "1px solid rgba(139,92,246,0.5)";
          e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(139,92,246,0.15)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};

export default SearchPrimary;
