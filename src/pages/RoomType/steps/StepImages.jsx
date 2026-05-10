import { Plus, Trash2, ImageOff, Star } from "lucide-react";

const StepImages = ({ images, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="flex flex-col gap-3">
      {images.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-700">
          <ImageOff size={28} />
          <p className="text-[11px]">
            Chưa có hình ảnh. Nhấn "+ Thêm ảnh" để thêm.
          </p>
        </div>
      )}

      {images.map((img, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.025]"
        >
          <div className="flex items-center gap-2">
            {/* Preview */}
            <div className="w-14 h-14 rounded-lg shrink-0 border border-white/[0.08] bg-white/[0.04] overflow-hidden flex items-center justify-center">
              {img.url ? (
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <ImageOff size={16} className="text-gray-700" />
              )}
            </div>

            {/* URL input */}
            <input
              type="text"
              value={img.url}
              onChange={(e) => onUpdate(i, "url", e.target.value)}
              placeholder="https://..."
              className="flex-1 h-10 px-3 rounded-lg bg-white/[0.04] text-[12px] font-semibold text-gray-200 outline-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
            />

            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* isCover toggle */}
          <div className="flex items-center gap-2 ml-16">
            <button
              onClick={() => onUpdate(i, "isCover", !img.isCover)}
              className={`flex items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-colors ${
                img.isCover
                  ? "text-[#dda6ff]"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  img.isCover
                    ? "bg-[#b026ff] border-[#b026ff]"
                    : "bg-transparent border-gray-600"
                }`}
              />
              <Star size={10} className={img.isCover ? "fill-[#dda6ff]" : ""} />
              Ảnh bìa
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-[rgba(176,38,255,0.3)] text-[11px] font-black text-[#b026ff] hover:bg-[rgba(176,38,255,0.06)] transition-colors cursor-pointer"
      >
        <Plus size={13} /> Thêm ảnh
      </button>

      <p className="text-[9px] text-gray-700 text-center">
        Upload Cloudinary sẽ được hỗ trợ sau. Hiện tại nhập URL trực tiếp.
      </p>
    </div>
  );
};

export default StepImages;
