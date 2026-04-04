import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { LoreForm } from "@/components/lore-form";
import { LoreCard } from "@/components/lore-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/lore/")({
	component: RouteComponent,
});

function RouteComponent() {
	const lores = useRPGStore((state) => state.lores);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLores = lores.filter((l) =>
		l.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Lore</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									O Livro de Histórias e Conhecimentos Ocultos
								</span>
							</div>
							<LoreForm />
						</div>
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredLores.map((lore) => (
								<LoreCard key={lore.id} lore={lore} />
							))}
							{filteredLores.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhum registro de lore encontrado.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
