import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useState } from "react";
import { CharacterCard } from "@/components/character-card";
import { CharacterForm } from "@/components/character-form";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/characters/")({
	component: RouteComponent,
});

function RouteComponent() {
	const characters = useRPGStore((state) => state.characters);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCharacters = characters.filter((c) =>
		c.characterName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="w-full">
			<PageHeader
				title="Personagens"
				description="Os heróis e protagonistas da sua campanha"
				Icon={User}
				iconColor="text-violet-300"
				eyebrow="Heróis"
				count={characters.length}
				action={<CharacterForm />}
			/>

			<div className="space-y-4 px-6 py-5">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{filteredCharacters.map((character) => (
						<CharacterCard key={character.id} character={character} />
					))}
					{filteredCharacters.length === 0 && (
						<EmptyState
							Icon={User}
							title="Nenhum personagem encontrado"
							description="Comece adicionando o primeiro herói da sua campanha."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
