import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/npcs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/npcs/"!</div>
}
