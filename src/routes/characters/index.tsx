import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
	type CharacterFormData,
	CharacterFormModal,
} from "@/components/character-form-modal";
import { ListLayout } from "@/components/list-layout";

export const Route = createFileRoute("/characters/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddCharacter = (data: CharacterFormData) => {
		console.log("Novo personagem:", data);
	};

	return (
		<div className="flex flex-1">
			<div className="w-full">
				<div className="py-6 px-8 border-b border-border">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Personagens</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie seus personagens
								</span>
							</div>
							<button
								type="button"
								onClick={() => setIsModalOpen(true)}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-dark text-primary text-sm font-medium transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
							>
								<Plus /> Adicionar Novo
							</button>
						</div>
						<ListLayout />
					</div>
				</div>
			</div>

			<CharacterFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleAddCharacter}
			/>
		</div>
	);
}
