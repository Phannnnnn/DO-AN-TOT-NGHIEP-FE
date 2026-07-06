import React from "react";
import { Home, ArrowLeft, ShieldAlert } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070511] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background minimal light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px] bg-indigo-500" />
      </div>

      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="max-w-md w-full flex flex-col items-center text-center relative z-10">
        {/* Minimal Shield Alert Box */}
        <div className="relative mb-8">
          <div className="relative p-5 rounded-[8px] bg-white/[0.02] border border-white/[0.08] shadow-sm">
            <ShieldAlert className="w-10 h-10 text-violet-400" />
          </div>
        </div>

        {/* 404 Header */}
        <div className="space-y-3 mb-10">
          <h1 className="text-8xl font-mono font-bold tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            404
          </h1>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Liên kết không tồn tại hoặc bị chặn
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-light">
              Hệ thống không tìm thấy đường dẫn được chỉ định. Tệp có thể đã bị xóa 
              hoặc bạn không có đủ thẩm quyền truy cập phân hệ này.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-9 flex items-center justify-center gap-2 px-5 text-xs font-medium text-slate-300 rounded-[6px] transition-all duration-200 hover:text-white cursor-pointer bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto h-9 flex items-center justify-center gap-2 px-6 text-xs font-medium text-white rounded-[6px] transition-all duration-200 cursor-pointer bg-violet-600 hover:bg-violet-500 active:scale-[0.98] border border-violet-500/20"
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
