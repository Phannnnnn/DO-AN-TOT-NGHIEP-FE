const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-all cursor-pointer shrink-0 ${
      active
        ? "border-violet-500 text-violet-300 bg-violet-500/10"
        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]"
    }`}
  >
    <Icon size={16} className="shrink-0" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default TabButton;
