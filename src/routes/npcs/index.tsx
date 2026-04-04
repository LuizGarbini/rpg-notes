import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { NpcForm } from "@/components/npc-form";
import { NpcCard } from "@/components/npc-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/npcs/")({
	component: RouteComponent,
});

function RouteComponent() {
	const npcs = useRPGStore((state) => state.npcs);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredNpcs = npcs.filter((npc) =>
		npc.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">NPCs</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie seus NPCs
								</span>
							</div>
							<NpcForm />
						</div>
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredNpcs.map((npc) => (
								<NpcCard key={npc.id} npc={npc} />
							))}
							{filteredNpcs.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhum NPC encontrado.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
