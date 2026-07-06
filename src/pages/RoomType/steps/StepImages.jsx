import { useState } from "react";
import { Plus, Trash2, ImageOff, Star, Upload, Loader2 } from "lucide-react";
import { cloudinaryService } from "@/services/cloudinary/cloudinaryService";
import { useNotification } from "@/context/ContextProvider";

const uploadToCloudinary = async (file, toast) => {
  try {
    const signRes = await cloudinaryService.generateSignature("images");
    if (signRes.success) {
      const { cloudName, timestamp, signature, apiKey, folder } = signRes.data;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("folder", folder);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      const uploadRes = await cloudinaryService.upload(cloudName, formData);
      const data = await uploadRes.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    }
  } catch (error) {
    if (toast) {
      toast.error("Lỗi upload", error.message);
    } else {
      console.error(error);
    }
  }
};

const StepImages = ({ images, onAdd, onRemove, onUpdate }) => {
  const toast = useNotification();
  const [uploading, setUploading] = useState({}); // { index: true/false }

  const handleFileChange = async (i, file) => {
    if (!file) return;
    setUploading((p) => ({ ...p, [i]: true }));
    try {
      const url = await uploadToCloudinary(file, toast);
      onUpdate(i, "url", url);
    } catch (err) {
      toast.error("Lỗi upload", err.message);
    } finally {
      setUploading((p) => ({ ...p, [i]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {images.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-zinc-500">
          <ImageOff size={28} />
          <p className="text-xs">
            Chưa có hình ảnh. Nhấn "+ Thêm ảnh" để thêm.
          </p>
        </div>
      )}

      {images.map((img, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3 rounded-[6px] border border-white/[0.06] bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            {/* Preview */}
            <div className="w-14 h-14 rounded-[4px] shrink-0 border border-white/[0.08] bg-white/[0.04] overflow-hidden flex items-center justify-center">
              {uploading[i] ? (
                <Loader2 size={16} className="text-violet-400 animate-spin" />
              ) : img.url ? (
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <ImageOff size={16} className="text-zinc-600" />
              )}
            </div>

            {/* Upload button + URL input */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 h-9 px-3 rounded-[6px] bg-white/[0.02] border border-white/[0.08] hover:border-violet-500/30 hover:bg-white/[0.04] cursor-pointer transition-all">
                <Upload size={12} className="text-violet-400 shrink-0" />
                <span className="text-xs text-zinc-500 truncate">
                  {uploading[i]
                    ? "Đang upload..."
                    : img.url
                      ? "Đổi ảnh"
                      : "Chọn ảnh từ máy"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading[i]}
                  onChange={(e) => handleFileChange(i, e.target.files?.[0])}
                />
              </label>
              <input
                type="text"
                value={img.url}
                onChange={(e) => onUpdate(i, "url", e.target.value)}
                placeholder="Hoặc nhập URL trực tiếp..."
                className="h-8 px-3 rounded-[6px] bg-white/[0.02] text-xs font-normal text-gray-200 outline-none border border-white/[0.08] focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
              />
            </div>

            <button
              onClick={() => onRemove(i)}
              className="p-1.5 rounded-[4px] border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* isCover toggle */}
          <div className="flex items-center gap-2 ml-16">
            <button
              onClick={() => onUpdate(i, "isCover", !img.isCover)}
              className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${img.isCover ? "text-violet-300" : "text-zinc-500 hover:text-zinc-400"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border transition-all ${img.isCover ? "bg-violet-500 border-violet-500" : "bg-transparent border-zinc-600"}`}
              />
              <Star size={10} className={img.isCover ? "fill-violet-300 text-violet-300" : "text-zinc-500"} />
              Ảnh bìa
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 h-9 rounded-[6px] border border-dashed border-white/[0.08] text-xs font-medium text-violet-400 hover:bg-violet-500/5 hover:border-violet-500/20 transition-all active:scale-[0.98] cursor-pointer"
      >
        <Plus size={13} /> Thêm ảnh
      </button>
    </div>
  );
};

export default StepImages;
