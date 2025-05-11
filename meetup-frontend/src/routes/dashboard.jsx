import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage } from "../pages/CompanyPage";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompanyPage />;
}
