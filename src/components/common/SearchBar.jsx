import { Search } from "lucide-react";

const SearchBar = ({ ...props }) => {
  return (
    <div className="flex items-center bg-slate-200 border-transparent rounded-lg border focus-within:border-[var(--blue)] transition-all duration-200">
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 outline-none bg-transparent"
        onChange={(e) => {
          setTextSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
          }
        }}
        {...props}
      />

      <div className="py-3 px-5 border-l border-transparent bg-[var(--white)]/10 transition-colors rounded-r-4xl cursor-pointer">
        <Search
          size={20}
          color="#ffffff"
          strokeWidth={2.6}
          absoluteStrokeWidth
        />
      </div>
    </div>
  );
};

export default SearchBar;
