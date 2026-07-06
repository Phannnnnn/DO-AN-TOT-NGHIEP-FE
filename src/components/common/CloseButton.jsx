const CloseButton = ({ onClose, label = "Đóng" }) => {
 return (
 <button
 onClick={onClose}
 className="flex-1 h-11 rounded-xl text-xs font-bold text-gray-500 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
 >
 {label}
 </button>
 );
};

export default CloseButton;
