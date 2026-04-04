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
	race: z.string(),
	role: z.string(),
	location: z.string(),
	description: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function NpcForm() {
	const { register, handleSubmit, reset } = useForm<FormFilterSchema>({
		resolver: zodResolver(formFilterSchema),
	});
	const [isOpen, setIsOpen] = useState(false);
	const addNpc = useRPGStore((state) => state.addNpc);

	function handleCreateForm(data: FormFilterSchema) {
		addNpc(data);
		setIsOpen(false);
		reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="default">
					<Plus className="mr-2 h-4 w-4" />
					Adicionar NPC
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(handleCreateForm)}
				>
					<DialogHeader>
						<DialogTitle>Novo NPC</DialogTitle>
						<DialogDescription>
							Adicione os detalhes do NPC.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name">Nome do NPC</Label>
							<Input
								placeholder="Ex: Bob, O Taberneiro"
								{...register("name")}
							/>
						</div>
						<div className="grid gap-3 grid-cols-2">
							<div className="flex flex-col gap-3">
								<Label htmlFor="race">Raça</Label>
								<Input
									placeholder="Ex: Humano"
									{...register("race")}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="role">Papel</Label>
								<Input
									placeholder="Ex: Mercador"
									{...register("role")}
								/>
							</div>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="location">Localização</Label>
							<Input
								placeholder="Ex: Vila de Vallaki"
								{...register("location")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description">Descrição</Label>
							<Input
								placeholder="Ex: Cara gente boa, mas careiro."
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
						<Button type="submit">Adicionar NPC</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
