import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meetups')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/meetups"!</div>
}
