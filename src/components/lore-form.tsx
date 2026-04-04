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
import { Textarea } from "./ui/textarea";

const formFilterSchema = z.object({
	title: z.string().min(1, "Obrigatório"),
	category: z.string(),
	content: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function LoreForm() {
	const { register, handleSubmit, reset } = useForm<FormFilterSchema>({
		resolver: zodResolver(formFilterSchema),
	});
	const [isOpen, setIsOpen] = useState(false);
	const addLore = useRPGStore((state) => state.addLore);

	function handleCreateForm(data: FormFilterSchema) {
		addLore(data);
		setIsOpen(false);
		reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="default">
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Lore
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(handleCreateForm)}
				>
					<DialogHeader>
						<DialogTitle>Registro de Lore</DialogTitle>
						<DialogDescription>
							Registre a história, divindades ou segredos do mundo.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="title">Título</Label>
							<Input
								placeholder="Ex: A Época de Prata"
								{...register("title")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="category">Categoria</Label>
							<Input
								placeholder="Ex: Mitologia, Religião, Evento Histórico..."
								{...register("category")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="content">Conteúdo</Label>
							<Textarea
								className="min-h-[120px] resize-none"
								placeholder="Um longo tempo atrás, os deuses caíram..."
								{...register("content")}
							/>
						</div>
					</div>
					<DialogFooter className="flex gap-2 sm:gap-0 mt-4">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancelar
							</Button>
						</DialogClose>
						<Button type="submit">Adicionar Lore</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
