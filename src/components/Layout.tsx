import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  );
}
