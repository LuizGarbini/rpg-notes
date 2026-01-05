import { Plus, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
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

export function MultiStepPlayground() {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		class: "",
		level: 1,
	});

	return (
		<Dialog>
			<form>
				<DialogTrigger>
					<Button type="button" variant="default">
						<Plus />
						Adicionar Personagem
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					{currentStep === 0 && (
						<>
							<DialogHeader>
								<DialogTitle>Informações Básicas</DialogTitle>
								<DialogDescription>
									Defina a indentidade do seu personagem.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="character-name">Nome do Personagem</Label>
									<Input
										name="character-name"
										placeholder="Ex: Aragorn, Gandalf, Legolass..."
									/>
								</div>
								<div className="grid gap-3 grid-cols-2">
									<div className="flex flex-col gap-3">
										<Label htmlFor="race">Raça</Label>
										<Input name="race" placeholder="Ex: Elfo, Anão..." />
									</div>
									<div className="flex flex-col gap-3">
										<Label htmlFor="class">Classe</Label>
										<Input
											name="class"
											placeholder="Ex: Guerreiro, Ladino..."
										/>
									</div>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="background">Background</Label>
									<Input
										name="background"
										placeholder="História do personagem"
									/>
								</div>
							</div>
							<DialogFooter className="flex flex-col">
								<DialogClose>
									<Button type="button" variant="outline">
										Cancelar
									</Button>
								</DialogClose>

								<Button
									type="button"
									onClick={() => setCurrentStep((prev) => prev + 1)}
								>
									Próximo
								</Button>
							</DialogFooter>
						</>
					)}
					{currentStep === 1 && (
						<>
							<DialogHeader>
								<DialogTitle>Nível e Experiência</DialogTitle>
								<DialogDescription>
									Configure o nível atual e a experiência do seu personagem.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name-1">Name</Label>
									<Input name="name" defaultValue="Pedro Duarte" />
								</div>
								<div className="grid gap-3">
									<Label htmlFor="username-1">Username</Label>
									<Input name="username" defaultValue="@peduarte" />
								</div>
							</div>
							<DialogFooter className="flex flex-col">
								<Button
									type="button"
									variant="outline"
									onClick={() => setCurrentStep((prev) => prev - 1)}
								>
									Anterior
								</Button>
								<Button
									type="button"
									onClick={() => setCurrentStep((prev) => prev + 1)}
								>
									Próximo
								</Button>
							</DialogFooter>
						</>
					)}
					{currentStep === 2 && (
						<>
							<DialogHeader>
								<DialogTitle>Informações Básicas</DialogTitle>
								<DialogDescription>
									Defina a indentidade do seu personagem
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name-1">Name</Label>
									<Input name="name" defaultValue="Pedro Duarte" />
								</div>
								<div className="grid gap-3">
									<Label htmlFor="username-1">Username</Label>
									<Input name="username" defaultValue="@peduarte" />
								</div>
								<DialogFooter className="flex flex-col">
									<Button
										type="button"
										variant="outline"
										onClick={() => setCurrentStep((prev) => prev - 1)}
									>
										Anterior
									</Button>
									<DialogClose>
										<Button type="submit">Criar Personagem</Button>
									</DialogClose>
								</DialogFooter>
							</div>
						</>
					)}
				</DialogContent>
			</form>
		</Dialog>
	);
}
