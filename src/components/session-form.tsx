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
	title: z.string().min(1, "Obrigatório"),
	date: z.string(),
	summary: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function SessionForm() {
	const { register, handleSubmit, reset } = useForm<FormFilterSchema>({
		resolver: zodResolver(formFilterSchema),
	});
	const [isOpen, setIsOpen] = useState(false);
	const addSession = useRPGStore((state) => state.addSession);

	function handleCreateForm(data: FormFilterSchema) {
		addSession(data);
		setIsOpen(false);
		reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="default">
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Sessão
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(handleCreateForm)}
				>
					<DialogHeader>
						<DialogTitle>Nova Sessão</DialogTitle>
						<DialogDescription>
							Registre os acontecimentos da campanha.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="title">Título da Sessão</Label>
							<Input
								placeholder="Ex: A Caverna dos Goblins"
								{...register("title")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="date">Data da Sessão (In Game ou Real)</Label>
							<Input
								placeholder="Ex: 12/04/2026 ou 15 de Mirtul"
								{...register("date")}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="summary">Resumo</Label>
							<Input
								placeholder="Ex: O grupo encontrou um tesouro e quase morreu."
								{...register("summary")}
							/>
						</div>
					</div>
					<DialogFooter className="flex gap-2 sm:gap-0 mt-4">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancelar
							</Button>
						</DialogClose>
						<Button type="submit">Adicionar Sessão</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
