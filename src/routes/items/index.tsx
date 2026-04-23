import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { ItemForm } from "@/components/item-form";
import { ListLayout } from "@/components/list-layout";
import { PageHeader } from "@/components/page-header";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/items/")({
	component: RouteComponent,
});

function RouteComponent() {
	const items = useRPGStore((state) => state.items);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = items.filter((i) =>
		i.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="w-full">
			<PageHeader
				title="Itens & Inventário"
				description="Tesouros, armas, poções e relíquias da sua campanha"
				Icon={Package}
				iconColor="text-emerald-300"
				eyebrow="Tesouro"
				count={items.length}
				action={<ItemForm />}
			/>

			<div className="space-y-4 px-6 py-5">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{filteredItems.map((item) => (
						<ItemCard key={item.id} item={item} />
					))}
					{filteredItems.length === 0 && (
						<EmptyState
							Icon={Package}
							title="Nenhum item encontrado"
							description="Adicione armas, armaduras ou itens mágicos ao seu inventário."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
