import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useRPGStore } from "@/lib/store";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const formFilterSchema = z.object({
	name: z.string().min(1, "Obrigatório"),
	type: z.string(),
	rarity: z.string(),
	description: z.string(),
	stats: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function ItemForm() {
	const { register, handleSubmit, reset } = useForm<FormFilterSchema>({
		resolver: zodResolver(formFilterSchema),
	});
	const [isOpen, setIsOpen] = useState(false);
	const addItem = useRPGStore((state) => state.addItem);

	function handleCreateForm(data: FormFilterSchema) {
		addItem(data);
		setIsOpen(false);
		reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="default">
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Item
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(handleCreateForm)}
				>
					<DialogHeader>
						<DialogTitle>Novo Item</DialogTitle>
						<DialogDescription>
							Registre um armamento, poção ou relíquia.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name">Nome do Item</Label>
							<Input
								placeholder="Ex: Espada Longa Flamejante"
								{...register("name")}
							/>
						</div>
						<div className="grid gap-3 grid-cols-2">
							<div className="flex flex-col gap-3">
								<Label htmlFor="type">Tipo</Label>
								<Input
									placeholder="Ex: Arma, Poção..."
									{...register("type")}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="rarity">Raridade</Label>
								<Input
									placeholder="Ex: Raro, Lendário..."
									{...register("rarity")}
								/>
							</div>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="stats">Atributos / Efeitos</Label>
							<Input
								placeholder="Ex: 1d8 cortante + 1d6 de fogo"
								{...register("stats")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description">Descrição / Lore</Label>
							<Input
								placeholder="Ex: Forjada nas profundezas de..."
								{...register("description")}
							/>
						</div>
					</div>
					<DialogFooter className="flex gap-2 sm:gap-0 mt-4">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancelar
							</Button>
						</DialogClose>
						<Button type="submit">Adicionar Item</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
