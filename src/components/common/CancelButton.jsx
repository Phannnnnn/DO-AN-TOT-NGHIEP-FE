import { X } from "lucide-react";

const CancelButton = ({ onClose }) => {
  return (
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg border border-[var(--red)]/10 bg-[var(--red)]/10 text-[var(--white)]/30 hover:bg-[var(--red)]/30 hover:text-[var(--red)] transition-colors cursor-pointer"
    >
      <X size={15} />
    </button>
  );
};

export default CancelButton;
