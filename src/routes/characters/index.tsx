import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import { CharacterCard } from "@/components/character-card";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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
				title="Elenco"
				description="A visão narrativa dos personagens que participam da campanha"
				Icon={User}
				iconColor="text-violet-300"
				eyebrow="Personagens da campanha"
				count={characters.length}
				action={
					<Link to="/sheets/new">
						<Button size="sm" className="gap-2">
							<Plus className="h-3.5 w-3.5" />
							Criar ficha
						</Button>
					</Link>
				}
			/>

			<div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 pb-10 sm:px-8">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredCharacters.map((character) => (
						<CharacterCard key={character.id} character={character} />
					))}
					{filteredCharacters.length === 0 && (
						<EmptyState
							Icon={User}
							title="Nenhum personagem no elenco"
							description="Crie uma ficha para adicionar o primeiro protagonista da campanha."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
