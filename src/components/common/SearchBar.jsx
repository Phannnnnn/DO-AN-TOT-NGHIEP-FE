import { Search } from "lucide-react";

const SearchBar = ({ ...props }) => {
  return (
    <div className="flex items-center bg-[#0a0616]/75 border border-[#b026ff]/25 rounded-xl focus-within:border-[#00f0ff] focus-within:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
      <input
        type="text"
        className="w-full px-4 py-2 bg-transparent text-sm text-white placeholder-gray-600 border-none focus:ring-0"
        onChange={(e) => {
          if (typeof setTextSearch !== "undefined") {
            setTextSearch(e.target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
          }
        }}
        {...props}
      />

      <div className="py-2.5 px-4 border-l border-[#b026ff]/20 bg-white/5 hover:bg-white/10 transition-colors rounded-r-xl cursor-pointer">
        <Search
          size={16}
          color="#ffffff"
          strokeWidth={2.6}
          absoluteStrokeWidth
        />
      </div>
    </div>
  );
};

export default SearchBar;
