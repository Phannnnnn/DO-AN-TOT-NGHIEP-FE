import React from "react";
import LabelHeader from "../common/LabelHeader";
import Timer from "../common/Timer";
import { useAuth } from "@/context/ContextProvider";
import { Hotel } from "lucide-react";

const AppHeader = () => {
  const { user } = useAuth();

  const fullName = user?.fullName || "Admin User";
  const nameParts = fullName.split(" ");
  const lastNameUser = nameParts[nameParts.length - 1];
  const firstNameUser = nameParts[0];
  const avatarUser = (
    firstNameUser.charAt(0) + lastNameUser.charAt(0)
  ).toUpperCase();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Chào buổi sáng"
      : currentHour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  return (
    <header
      className="sticky top-0 z-50 w-full px-8 py-3.5 select-none border-b border-[#b026ff]/30"
      style={{
        background: "rgba(15,10,25,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* LEFT: Logo + divider + page label */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #b026ff, #7c3aed)",
                boxShadow: "0 0 16px rgba(176,38,255,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(176,38,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 16px rgba(176,38,255,0.3)";
              }}
            >
              <Hotel className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">
              Lumina<span className="text-[#b026ff]">Hotel</span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />
          <LabelHeader />
        </div>

        {/* RIGHT: Timer + divider + profile */}
        <div className="flex items-center gap-6">
          <Timer />

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.12em] mb-1">
                {greeting}
              </span>
              <span
                className="text-xs font-bold text-[#9ca3af] transition-colors"
                style={{}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#b026ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                {lastNameUser}
              </span>
            </div>

            <div
              className="h-9 w-9 rounded-full flex items-center justify-center relative transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid rgba(176,38,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.08)";
              }}
            >
              <span className="text-[11px] font-black text-[#9ca3af]">
                {avatarUser}
              </span>
              {/* Online dot */}
              <div
                className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2"
                style={{ background: "#10b981", borderColor: "#0f0a19" }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
