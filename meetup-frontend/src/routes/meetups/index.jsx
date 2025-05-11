import { createFileRoute } from "@tanstack/react-router";
import { MeetupsPage } from "../../pages/MeetupsPage";

export const Route = createFileRoute("/meetups/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MeetupsPage />;
}
