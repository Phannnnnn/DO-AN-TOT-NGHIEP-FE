import { Download } from "lucide-react";

const ExportButton = ({ label = "Tải xuống", onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // Thay đổi class ở đây
      className="w-full sm:w-auto justify-center flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.3)] text-[#00f0ff] text-xs font-bold hover:bg-[rgba(0,240,255,0.25)] transition-all cursor-pointer disabled:opacity-50"
    >
      <Download size={12} />
      {label}
    </button>
  );
};

export default ExportButton;
