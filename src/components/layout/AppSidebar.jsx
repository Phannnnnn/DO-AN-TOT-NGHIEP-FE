import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { MENU_GROUPS } from "@/constants/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarMenuButton,
} from "../ui/sidebar";
import { useAuth } from "@/context/ContextProvider";

const AppSidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { open, setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const filteredMenuGroups = MENU_GROUPS.map((group) => {
    const filteredItems = group.items.filter(
      (item) =>
        !item.allowedRoles || (user && item.allowedRoles.includes(user.role)),
    );
    return { ...group, items: filteredItems };
  }).filter((group) => group.items.length > 0);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#05020c] border-r border-[#b026ff]/20"
    >
      {/* ── Header ── */}
      <SidebarHeader className={`items-start bg-[#05020c]`}>
        <SidebarTrigger className="!bg-transparent cursor-pointer" />
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent className="bg-[#05020c] py-2 overflow-x-hidden">
        {filteredMenuGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0 mb-1">
            {/* Group label: visible expanded, hidden collapsed */}
            <p className="text-xs font-bold text-gray-600 px-4 pt-2 pb-1 group-data-[state=collapsed]:hidden">
              {group.label}
            </p>

            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <SidebarMenuItem key={item.path} className="px-2 list-none">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={`${active ? "bg-[#b026ff]/30 border border-[#b026ff]/60 shadow-[0_0_20px_rgba(176,38,255,0.2)] text-[var(--white)] hover:bg-[#b026ff]/30 active:bg-[#b026ff]/30 hover:text-[var(--white)] active:text-[var(--white)]" : "border border-transparent text-[var(--white)]/60 active:bg-[#b026ff]/30 active:text-[var(--white)] hover:bg-[#b026ff]/10 hover:text-[var(--white)] transition-all duration-300"} 
 py-5 group-data-[state=collapsed]:hover:text-[var(--white)] group-data-[state=collapsed]:active:bg-[#b026ff]/30 group-data-[state=collapsed]:mx-auto`}
                    >
                      <Link
                        to={item.path}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          absoluteStrokeWidth
                          size={16}
                        />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="bg-[#05020c] border-t border-[#b026ff]/20 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-0 list-none">
            <SidebarMenuButton
              tooltip={"Đăng xuất"}
              onClick={logout}
              className="relative flex items-center h-10 rounded-xl transition-all duration-150 gap-3 border border-transparent text-gray-400 hover:text-[var(--red)] active:text-[var(--white)] hover:bg-[var(--red)]/10 active:bg-[var(--red)]/60 hover:border-red-500/20 cursor-pointer"
            >
              <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
              <span className="text-xs font-medium group-data-[state=collapsed]:hidden">
                Đăng xuất
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
