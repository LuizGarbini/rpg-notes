import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { ItemForm } from "@/components/item-form";
import { ItemCard } from "@/components/item-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/items/")({
	component: RouteComponent,
});

function RouteComponent() {
	const items = useRPGStore((state) => state.items);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = items.filter((i) =>
		i.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Itens</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie os itens da sua campanha
								</span>
							</div>
							<ItemForm />
						</div>
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredItems.map((item) => (
								<ItemCard key={item.id} item={item} />
							))}
							{filteredItems.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhum item encontrado.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
