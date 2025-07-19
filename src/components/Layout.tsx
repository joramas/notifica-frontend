import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
