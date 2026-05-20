import LabelHeader from "../common/LabelHeader";
import Timer from "../common/Timer";
import { useAuth } from "@/context/ContextProvider";

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
            <span className="text-sm font-black text-white tracking-tight">
              Management<span className="text-[#b026ff]">Hotel</span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />
          <LabelHeader />
        </div>

        {/* RIGHT: Timer + divider + profile */}
        <div className="flex items-center gap-6">
          <Timer />

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-3 group">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.12em] mb-1">
                {greeting}
              </span>
              <span className="text-xs font-bold text-[#9ca3af] transition-colors">
                {lastNameUser}
              </span>
            </div>

            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--high-purple)] animate-spin z-10" />

              <div className="group relative flex h-full w-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] transition-all hover:bg-white/[0.08]">
                <span className="text-[11px] font-black text-gray-400 uppercase">
                  {avatarUser}
                </span>

                <div className="absolute z-20 bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0f0a19] bg-[var(--green)]" />

                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
