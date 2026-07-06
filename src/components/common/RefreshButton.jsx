import { RefreshCw } from "lucide-react";

const RefreshButton = ({ label = "Làm mới", onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      // Thay đổi class ở đây
      className="w-full sm:w-auto justify-center flex items-center gap-1.5 h-8 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
    >
      <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
      {label}
    </button>
  );
};

export default RefreshButton;
