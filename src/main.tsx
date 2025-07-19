import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "@/pages/Landing";
import SelectPlan from "@/pages/SelectPlan";
import Layout from "./components/Layout";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import "./index.css";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  // NOTE: Public routes (no Layout)
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/select-plan",
    element: <SelectPlan />,
  },
  // NOTE: Authenticated routes (with Layout)
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/clientes", element: <Clients /> },
      { path: "/configuracion", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors position="bottom-right" />
  </StrictMode>,
);
