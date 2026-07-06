const BadgeButton = ({ onClick, active, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
        active
          ? "bg-[rgba(176,38,255,0.15)] border-[rgba(176,38,255,0.4)] text-[#dda6ff]"
          : "bg-white/[0.03] border-white/[0.07] text-gray-600 hover:border-white/[0.15] hover:text-gray-400"
      }`}
    >
      {label}
    </button>
  );
};

export default BadgeButton;
