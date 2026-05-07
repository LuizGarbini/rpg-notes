import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { LocationCard } from "@/components/location-card";
import { LocationForm } from "@/components/location-form";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/locations/")({
	component: RouteComponent,
});

function RouteComponent() {
	const locations = useRPGStore((state) => state.locations);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLocations = locations.filter((l) =>
		l.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const isLoading = useRPGStore((state) => state.isLoadingRemote);

	return (
		<div className="w-full">
			<PageHeader
				title="Locais e Mapas"
				description="Cidades, dungeons e fronteiras já exploradas"
				Icon={MapIcon}
				iconColor="text-rose-300"
				eyebrow="Cartografia"
				count={locations.length}
				action={<LocationForm />}
			/>

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 pb-10 sm:px-8">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredLocations.map((location) => (
						<LocationCard key={location.id} location={location} />
					))}
					{filteredLocations.length === 0 && (
						<EmptyState
							Icon={MapIcon}
							title="Nenhum local encontrado"
							description="Registre os reinos e cenários que o grupo descobre."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
