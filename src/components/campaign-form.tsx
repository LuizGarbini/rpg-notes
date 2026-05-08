import { useState } from "react";
import { useRPGStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface CampaignFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CampaignForm({ open, onOpenChange }: CampaignFormProps) {
	const createCampaign = useRPGStore((s) => s.createCampaign);
	const switchCampaign = useRPGStore((s) => s.switchCampaign);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim() || isCreating) return;

		setIsCreating(true);
		try {
			const campaign = await createCampaign(name.trim(), description.trim());
			await switchCampaign(campaign.id);
			setName("");
			setDescription("");
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao criar campanha:", error);
		} finally {
			setIsCreating(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-display">Nova Campanha</DialogTitle>
					<DialogDescription>
						Crie uma nova campanha com ambiente independente. Todos os dados
						começarão do zero.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="campaign-name"
							className="text-[12px] font-semibold text-foreground"
						>
							Nome da Campanha *
						</label>
						<Input
							id="campaign-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ex: A Maldição de Strahd"
							autoFocus
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="campaign-description"
							className="text-[12px] font-semibold text-foreground"
						>
							Descrição
						</label>
						<Textarea
							id="campaign-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Uma breve descrição da campanha..."
							rows={3}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={!name.trim() || isCreating}>
							{isCreating ? "Criando..." : "Criar Campanha"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
