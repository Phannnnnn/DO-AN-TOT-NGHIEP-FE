import { Home, ArrowLeft, SearchX } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#0f0a19" }}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center gap-8">
        {/* Icon */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(176,38,255,0.15)",
              filter: "blur(24px)",
            }}
          />
          <div
            className="relative p-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(176,38,255,0.15)",
            }}
          >
            <SearchX className="w-10 h-10 text-[#b026ff]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1
            className="text-8xl font-black tracking-tighter"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #b026ff 60%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Không tìm thấy trang
          </h2>
          <p className="text-sm text-[#4b5563] leading-relaxed max-w-sm mx-auto">
            Đường dẫn bạn truy cập có thể đã bị thay đổi, xóa bỏ hoặc bạn không
            có quyền truy cập vào phân hệ này.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.history.back()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#6b7280] rounded-xl transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, #b026ff, #7c3aed)",
              boxShadow: "0 4px 20px rgba(176,38,255,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 28px rgba(176,38,255,0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(176,38,255,0.35)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Home className="w-3.5 h-3.5" />
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
