import { Save } from "lucide-react";

const SaveButton = ({ label = "Lưu", onSave }) => {
 return (
 <button
 onClick={onSave}
 className="flex-[2] h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-br from-[#b026ff] to-[#7c3aed] shadow-[0_4px_16px_rgba(176,38,255,0.35)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.5)] transition-all cursor-pointer"
 >
 <Save size={14} />
 {label}
 </button>
 );
};

export default SaveButton;
