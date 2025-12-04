import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lore/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lore/"!</div>
}
