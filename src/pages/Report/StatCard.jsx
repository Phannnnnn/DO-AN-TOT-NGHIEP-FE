const StatCard = ({ label, value, sub }) => (
  <div className="flex flex-col text-center justify-between p-5 rounded-[8px] bg-[#120d1e]/80 border border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200">
    <p className="text-xs md:text-base font-medium text-[var(--white)]/60 mb-2">
      {label}
    </p>
    <p className="text-xs md:text-base lg:text-lg font-semibold font-mono text-[var(--white)]">
      {value}
    </p>
    <p className="text-xs md:text-base font-medium font-mono text-emerald-400 mt-1.5">
      {sub ? sub : ""}
    </p>
  </div>
);

export default StatCard;
