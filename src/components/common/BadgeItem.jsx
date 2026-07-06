const BadgeItem = ({ label }) => {
  return (
   <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
      {label}
    </span>
  );
};
export default BadgeItem;
