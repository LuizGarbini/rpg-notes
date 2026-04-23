import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { LoreCard } from "@/components/lore-card";
import { LoreForm } from "@/components/lore-form";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/lore/")({
	component: RouteComponent,
});

function RouteComponent() {
	const lores = useRPGStore((state) => state.lores);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLores = lores.filter((l) =>
		l.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="w-full">
			<PageHeader
				title="Lore & Notas"
				description="O grimório de histórias, mitos e conhecimentos ocultos"
				Icon={BookOpen}
				iconColor="text-indigo-300"
				eyebrow="Grimório"
				count={lores.length}
				action={<LoreForm />}
			/>

			<div className="space-y-4 px-6 py-5">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredLores.map((lore) => (
						<LoreCard key={lore.id} lore={lore} />
					))}
					{filteredLores.length === 0 && (
						<EmptyState
							Icon={BookOpen}
							title="Nenhum registro de lore"
							description="Comece a escrever a história e a mitologia do seu mundo."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
