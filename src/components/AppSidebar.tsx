import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";

const nav_items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Clientes", href: "/clientes" },
  { label: "Usuario", href: "/usuario" },
  { label: "Configuración", href: "/configuracion" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border bg-background">
      <div className="p-6 text-2xl text-center font-extrabold tracking-tight">
        Notifica
      </div>

      <nav className="flex flex-col gap-1 px-4">
        {nav_items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition",
              location.pathname === item.href &&
              "bg-accent text-accent-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <footer className="mt-auto px-4 py-2 text-xs text-muted-foreground border-t border-border text-center">
        ©2025 ORVITech
      </footer>
    </Sidebar>
  );
}
