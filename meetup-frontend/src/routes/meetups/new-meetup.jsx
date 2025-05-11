import { createFileRoute } from "@tanstack/react-router";
import { NewMeetup } from "../../pages/NewMeetup";

export const Route = createFileRoute("/meetups/new-meetup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewMeetup />;
}
