import { Plus } from "lucide-react";

const AddButton = ({ onAddItem, addLabel = "Thêm mới" }) => {
  return (
    <button
      onClick={onAddItem}
      className="flex items-center gap-2 h-[42px] px-5 
                 bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] 
                 hover:from-[#6d28d9] hover:to-[#5b21b6]
                 text-white border-none rounded-[0.625rem] 
                 text-[11px] font-[900] tracking-[0.08em] uppercase 
                shrink-0 transition-all duration-200
                 shadow-[0_4px_20px_rgba(124,58,237,0.4)] 
                 hover:shadow-[0_6px_24px_rgba(124,58,237,0.5)] 
                 hover:-translate-y-[1px] 
                 active:translate-y-0 cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span>{addLabel}</span>
    </button>
  );
};

export default AddButton;
