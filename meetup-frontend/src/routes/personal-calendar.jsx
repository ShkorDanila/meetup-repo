import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal-calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/personal-calendar"!</div>
}
