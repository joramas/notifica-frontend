import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "@/pages/Landing";
import SelectPlan from "@/pages/SelectPlan";
import Success from "@/pages/Success";
import Layout from "./components/Layout";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import "./index.css";
import { AuthProvider } from "./context/auth";

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
  {
    path: "/success",
    element: <Success />,
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
