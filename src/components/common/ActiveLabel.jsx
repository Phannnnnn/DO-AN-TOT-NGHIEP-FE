const ActiveLabel = ({ isActive }) => {
  return (
    <div>
      {isActive ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-red-500/15 border-red-500/30 text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Khóa
        </span>
      )}
    </div>
  );
};

export default ActiveLabel;
