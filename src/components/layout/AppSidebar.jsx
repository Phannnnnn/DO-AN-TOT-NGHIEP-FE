import { Link, useLocation } from "react-router-dom";
import {
  Users,
  LogOut,
  LayoutDashboard,
  ConciergeBell,
  Bed,
  BarChart3,
  Hotel,
  Sparkles,
  CalendarCheck2,
  Contact2,
} from "lucide-react";
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

const MENU_GROUPS = [
  {
    label: "Tổng quan",
    items: [
      { id: 1, label: "Tổng quan", icon: LayoutDashboard, path: "/" },
      { id: 2, label: "Báo cáo", icon: BarChart3, path: "/reports" },
    ],
  },
  {
    label: "Phòng",
    items: [
      { id: 3, label: "Quản lý phòng", icon: Bed, path: "/rooms" },
      { id: 4, label: "Loại phòng", icon: Hotel, path: "/room-type" },
      {
        id: 5,
        label: "Tiện ích/giường",
        icon: ConciergeBell,
        path: "/room-config",
      },
      // {
      //   id: 6,
      //   label: "Buồng phòng",
      //   icon: WashingMachine,
      //   path: "/housekeeping",
      // },
    ],
  },
  {
    label: "Vận hành",
    items: [
      { id: 7, label: "Đặt phòng", icon: CalendarCheck2, path: "/bookings" },
      { id: 8, label: "Dịch vụ", icon: Sparkles, path: "/services" },
      // { id: 9, label: "Hóa đơn", icon: FileText, path: "/invoices" },
    ],
  },
  {
    label: "Nhân sự & KH",
    items: [
      { id: 10, label: "Người dùng", icon: Users, path: "/customers" },
      { id: 11, label: "Nhân sự", icon: Contact2, path: "/staff" },
    ],
  },
];

const AppSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { open } = useSidebar();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#0f0a19] border-r border-[#b026ff]/30"
    >
      {/* ── Header ── */}
      <SidebarHeader
        className={`${open ? "items-start" : "items-center"} bg-[#0f0a19] h-14 flex px-3`}
      >
        <SidebarTrigger className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer" />
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent className="bg-[#0f0a19] py-2 overflow-x-hidden">
        {MENU_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="px-0 mb-1">
            {/* Group label: visible expanded, hidden collapsed */}
            <p
              className="
              text-[9px] font-black text-gray-600 uppercase tracking-[0.18em]
              px-4 pt-2 pb-1
              group-data-[state=collapsed]:hidden
            "
            >
              {group.label}
            </p>

            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <SidebarMenuItem key={item.id} className="px-0 list-none">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={`${active ? "bg-[#b026ff]/30 border border-[#b026ff]/60 shadow-[0_0_20px_rgba(176,38,255,0.2)] text-[var(--white)] hover:bg-[#b026ff]/30 active:bg-[#b026ff]/30 hover:text-[var(--white)] active:text-[var(--white)]" : "border border-transparent text-[var(--white)]/60 active:bg-[#b026ff]/30 active:text-[var(--white)] hover:bg-[#b026ff]/10 hover:text-[var(--white)] transition-all duration-300"} 
                        py-5 group-data-[state=collapsed]:hover:text-[var(--white)] group-data-[state=collapsed]:active:bg-[#b026ff]/30 group-data-[state=collapsed]:mx-auto`}
                    >
                      <Link to={item.path}>
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
      <SidebarFooter className="bg-[#0f0a19] border-t border-[#b026ff]/30 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="px-0 list-none">
            <SidebarMenuButton
              tooltip={"Đăng xuất"}
              onClick={logout}
              className="
                relative flex items-center h-10 rounded-xl transition-all duration-150 gap-3 border border-transparent text-gray-400 hover:text-[var(--red)] active:text-[var(--white)] hover:bg-[var(--red)]/10 active:bg-[var(--red)]/60 hover:border-red-500/20 cursor-pointer
              "
            >
              <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
              <span className="text-[12px] font-medium group-data-[state=collapsed]:hidden">
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
