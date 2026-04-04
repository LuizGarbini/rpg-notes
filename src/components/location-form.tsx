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
	dangerLevel: z.string(),
	description: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function LocationForm() {
	const { register, handleSubmit, reset } = useForm<FormFilterSchema>({
		resolver: zodResolver(formFilterSchema),
	});
	const [isOpen, setIsOpen] = useState(false);
	const addLocation = useRPGStore((state) => state.addLocation);

	function handleCreateForm(data: FormFilterSchema) {
		addLocation(data);
		setIsOpen(false);
		reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="default">
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Local
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(handleCreateForm)}
				>
					<DialogHeader>
						<DialogTitle>Novo Local</DialogTitle>
						<DialogDescription>
							Registre uma cidade, masmorra ou região inexplorada.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name">Nome do Local</Label>
							<Input
								placeholder="Ex: Cavernas Ecoantes"
								{...register("name")}
							/>
						</div>
						<div className="grid gap-3 grid-cols-2">
							<div className="flex flex-col gap-3">
								<Label htmlFor="type">Tipo</Label>
								<Input
									placeholder="Ex: Masmorra, Cidade..."
									{...register("type")}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="dangerLevel">Nível de Perigo</Label>
								<Input
									placeholder="Ex: Alto, Baixo..."
									{...register("dangerLevel")}
								/>
							</div>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description">Descrição</Label>
							<Input
								placeholder="Ex: Uma série de túneis habitados por goblins."
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
						<Button type="submit">Adicionar Local</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
