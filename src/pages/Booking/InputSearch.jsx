import Stepper from "@/components/common/Stepper";
import { Users } from "lucide-react";

const InputSearch = ({
  adults,
  setAdults,
  children,
  resetSearch,
  setChildren,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
        <Users size={13} className="text-gray-600" />
        <span className="text-xs font-bold text-gray-600">Số khách</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Stepper
            label="Người lớn"
            value={adults}
            min={1}
            onChange={(v) => {
              setAdults(v);
              resetSearch();
            }}
          />
          <Stepper
            label="Trẻ em"
            value={children}
            min={0}
            onChange={(v) => {
              setChildren(v);
              resetSearch();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InputSearch;
