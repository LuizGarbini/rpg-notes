import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { CharacterForm } from "@/components/character-form";
import { CharacterCard } from "@/components/character-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/characters/")({
	component: RouteComponent,
});

function RouteComponent() {
	const characters = useRPGStore((state) => state.characters);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCharacters = characters.filter((c) =>
		c.characterName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
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
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredCharacters.map((character) => (
								<CharacterCard key={character.id} character={character} />
							))}
							{filteredCharacters.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhum personagem encontrado.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
