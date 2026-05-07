import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { NpcCard } from "@/components/npc-card";
import { NpcForm } from "@/components/npc-form";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/npcs/")({
	component: RouteComponent,
});

function RouteComponent() {
	const npcs = useRPGStore((state) => state.npcs);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredNpcs = npcs.filter((npc) =>
		npc.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const isLoading = useRPGStore((state) => state.isLoadingRemote);

	return (
		<div className="w-full">
			<PageHeader
				title="NPCs"
				description="Aliados, mercadores, vilões e todo coadjuvante do enredo"
				Icon={Users}
				iconColor="text-fuchsia-300"
				eyebrow="Coadjuvantes"
				count={npcs.length}
				action={<NpcForm />}
			/>

			<div className="space-y-4 px-6 py-5">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{isLoading
						? [...Array(10)].map((_, i) => <NpcCard key={`skeleton-${i}`} isLoading />)
						: filteredNpcs.map((npc) => <NpcCard key={npc.id} npc={npc} />)}
					{filteredNpcs.length === 0 && (
						<EmptyState
							Icon={Users}
							title="Nenhum NPC encontrado"
							description="Adicione personagens secundários para enriquecer o seu mundo."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
