import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/locations/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1">
			<div className="w-full">
				<div className="py-6 px-8 border-b border-border">
					<div className="flex flex-col">
						<h2 className="text-3xl font-bold">Locais e Mapas</h2>
						<span className="mt-1 text-sm text-muted-foreground">
							Gerencie seus locais e mapas
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
