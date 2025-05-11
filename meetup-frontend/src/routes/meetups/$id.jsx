import { createFileRoute } from "@tanstack/react-router";
import { CurrentMeetup } from "../../pages/CurrentMeetup";

export const Route = createFileRoute("/meetups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <CurrentMeetup meetupId={id} />;
}
