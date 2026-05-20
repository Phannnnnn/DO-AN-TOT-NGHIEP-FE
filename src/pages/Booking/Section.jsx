import { ChevronDown } from "lucide-react";

const Section = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.01]">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer ${
        isOpen
          ? "bg-white/[0.04] border-b border-white/[0.04]"
          : "hover:bg-white/[0.03]"
      } rounded-t-xl ${!isOpen && "rounded-b-xl"}`}
    >
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.12em]">
          {title}
        </span>
      </div>
      <ChevronDown
        size={14}
        className={`text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
);

export default Section;
