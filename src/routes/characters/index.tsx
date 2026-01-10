import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { CharacterForm } from "@/components/character-form";

export const Route = createFileRoute("/characters/")({
	component: RouteComponent,
});

function RouteComponent() {

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 border-b border-border h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Personagens</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie seus personagens
								</span>
							</div>
							<CharacterForm />
						</div>
						<ListLayout />
					</div>
				</div>
			</div>
		</div>
	);
}
