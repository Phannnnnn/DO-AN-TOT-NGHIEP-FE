import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full" style={{ background: "#0f0a19" }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
