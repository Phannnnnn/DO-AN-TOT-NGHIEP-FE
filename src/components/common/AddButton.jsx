import { Plus } from "lucide-react";

const AddButton = ({ onAddItem, addLabel = "Thêm mới" }) => {
  return (
    <button
      onClick={onAddItem}
      className="flex items-center gap-2 h-[36px] md:h-[42px] px-3 bg-gradient-to-r from-[#af26ffb0] to-[#00eeff91] hover:from-[#9333ea] hover:to-[#00c8ff] text-white border-none rounded-full text-xs font-[900] shrink-0 transition-all duration-300 shadow-[0_0_15px_rgba(176,38,255,0.45)] hover:shadow-[0_0_25px_rgba(0,240,255,0.65)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span>{addLabel}</span>
    </button>
  );
};

export default AddButton;
