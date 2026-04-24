const StatCard = ({
  icon: Icon,
  label,
  value,
  bgColor = "bg-[var(--white)]",
  iconBgColor,
}) => {
  return (
    <div className={`p-4 rounded-lg shadow ${bgColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[black]/60 text-sm font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-[black] mt-2">{value}</h3>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-[var(--white)]" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
