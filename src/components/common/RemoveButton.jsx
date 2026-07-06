import { Trash2 } from "lucide-react";

const RemoveButton = ({ onRemove }) => {
 return (
 <button
 onClick={onRemove}
 className="p-1.5 cursor-pointer rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
 >
 <Trash2 size={13} />
 </button>
 );
};

export default RemoveButton;
