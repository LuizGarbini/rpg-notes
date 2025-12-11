import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/characters/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1">
				<div className="w-full">
					<div className="py-6 px-8 border-b border-purple-800/25">
          <div className="flex flex-col">
						<h2 className="text-3xl font-bold">Personagens</h2>
						<span className="mt-1 text-sm text-muted-foreground">
							Gerencie seus personagens
						</span>
            </div>
					</div>
				</div>
			</div>
    )
}
