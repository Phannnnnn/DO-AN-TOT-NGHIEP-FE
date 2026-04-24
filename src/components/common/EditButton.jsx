import { Edit3 } from "lucide-react";

const EditButton = ({ onEdit }) => {
  return (
    <button
      onClick={onEdit}
      className="p-1.5 cursor-pointer rounded-lg border border-[rgba(176,38,255,0.3)] bg-[rgba(176,38,255,0.12)] text-[#c77dff] hover:bg-[#b026ff] hover:text-white hover:border-[#b026ff] transition-all"
    >
      <Edit3 size={13} />
    </button>
  );
};

export default EditButton;
