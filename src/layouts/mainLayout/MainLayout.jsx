import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-[#05020c]">
        <AppSidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          <AppHeader />

          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
