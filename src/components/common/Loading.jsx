import { BedDouble } from "lucide-react";

export const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-center"
      style={{
        background: "rgba(15, 10, 25, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner rings */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Vòng ngoài */}
          <div
            className="absolute w-24 h-24 rounded-full border-[3px] border-white/5 border-t-[#b026ff] animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
          {/* Vòng giữa — ngược chiều */}
          <div
            className="absolute w-16 h-16 rounded-full border-[3px] border-white/5 border-b-[#7c3aed] animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          />
          {/* Icon giữa */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #b026ff, #7c3aed)",
              boxShadow: "0 0 24px rgba(176,38,255,0.45)",
            }}
          >
            <BedDouble size={18} className="text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.25em]">
            Hotel Manager
          </p>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-[#b026ff] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
