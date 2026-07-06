import LabelHeader from "../common/LabelHeader";
import Timer from "../common/Timer";
import { useAuth } from "@/context/ContextProvider";
import logoImg from "../../assets/img/logo.svg";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      className="sticky top-0 z-50 w-full px-4 md:px-8 py-3.5 select-none border-b border-[#b026ff]/15"
      style={{
        background: "rgba(5, 2, 12, 0.7)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* LEFT: SidebarTrigger + Logo + divider + page label */}
        <div className="flex items-center gap-3 md:gap-5">
          <SidebarTrigger className="md:hidden text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] rounded-[6px] shrink-0" />

          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <img
              className="h-8 w-8 md:h-10 md:w-10 bg-transparent object-center object-contain"
              src={logoImg}
              alt="logo-img"
            />
          </div>

          <div className="h-4 w-px bg-white/10" />
          <LabelHeader />
        </div>

        {/* RIGHT: Timer + divider + profile */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:block">
            <Timer />
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/10" />

          <div className="flex items-center gap-3 group">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-xs font-bold mb-1">
                {greeting}, {lastNameUser}
              </span>
            </div>

            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--high-purple)] animate-spin z-10" />

              <div className="group relative flex h-full w-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] transition-all hover:bg-white/[0.08]">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover shadow-inner"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--high-purple)] to-purple-800 flex items-center justify-center text-white text-xs font-bold"
                  style={{ display: user?.avatar ? "none" : "flex" }}
                >
                  {avatarUser}
                </div>
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
