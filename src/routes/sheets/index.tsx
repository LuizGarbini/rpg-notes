import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";
import { CharacterCard } from "@/components/character-card";
import { CharacterForm } from "@/components/character-form";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/sheets/")({
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
				title="Fichas"
				description="Fichas de personagem de todos os sistemas"
				Icon={FileText}
				iconColor="text-emerald-300"
				eyebrow="Sheets"
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
							Icon={FileText}
							title="Nenhuma ficha encontrada"
							description="Crie sua primeira ficha de personagem usando o botão acima."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
