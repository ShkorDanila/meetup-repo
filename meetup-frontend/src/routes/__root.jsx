import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AppLayout from "../pages/AppLayout";
export const Route = createRootRoute({
  component: AppLayout,
});
