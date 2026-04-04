import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { LocationForm } from "@/components/location-form";
import { LocationCard } from "@/components/location-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/locations/")({
	component: RouteComponent,
});

function RouteComponent() {
	const locations = useRPGStore((state) => state.locations);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLocations = locations.filter((l) =>
		l.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Locais</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie os locais descobertos pelo grupo
								</span>
							</div>
							<LocationForm />
						</div>
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredLocations.map((location) => (
								<LocationCard key={location.id} location={location} />
							))}
							{filteredLocations.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhum local encontrado.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
