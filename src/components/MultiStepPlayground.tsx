import { Plus, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
	const { register, handleSubmit } = useForm();

	function handleCreateForm(data: any) {
		console.log(data);
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button type="button" variant="default">
					<Plus />
					Adicionar Personagem
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit(handleCreateForm)}>
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
									<Label htmlFor="characterName">Nome do Personagem</Label>
									<Input
										placeholder="Ex: Aragorn, Gandalf, Legolass..."
										{...register("characterName")}
									/>
								</div>
								<div className="grid gap-3 grid-cols-2">
									<div className="flex flex-col gap-3">
										<Label htmlFor="race">Raça</Label>
										<Input
											placeholder="Ex: Elfo, Anão..."
											{...register("race")}
										/>
									</div>
									<div className="flex flex-col gap-3">
										<Label htmlFor="class">Classe</Label>
										<Input
											placeholder="Ex: Guerreiro, Ladino..."
											{...register("class")}
										/>
									</div>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="background">Background</Label>
									<Input
										placeholder="História do personagem"
										{...register("background")}
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
								<div className="grid gap-3 grid-cols-2">
									<div className="flex flex-col gap-3">
										<Label htmlFor="level">Nível</Label>
										<Input
											max={20}
											min={1}
											type="number"
											placeholder="5"
											{...register("level")}
										/>
									</div>
									<div className="flex flex-col gap-3">
										<Label htmlFor="xp">Experiência</Label>
										<Input
											type="number"
											placeholder="500"
											{...register("xp")}
										/>
									</div>
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
								<div className="grid gap-3 grid-cols-2">
									<div className="flex flex-col gap-3">
										<Label htmlFor="health">Vida Atual</Label>
										<Input
											type="number"
											placeholder="10"
											{...register("health")}
										/>
									</div>
									<div className="flex flex-col gap-3">
										<Label htmlFor="healthMax">Vida Máxima</Label>
										<Input
											type="number"
											placeholder="150"
											{...register("healthMax")}
										/>
									</div>
								</div>
								<div className="grid gap-3 grid-cols-2">
									<div className="flex flex-col gap-3">
										<Label htmlFor="armorClass">Classe de Armadura</Label>
										<Input
											type="number"
											placeholder="25"
											{...register("armorClass")}
										/>
									</div>
									<div className="flex flex-col gap-3">
										<Label htmlFor="initiative">Iniciativa</Label>
										<Input
											type="number"
											placeholder="10"
											{...register("initiative")}
										/>
									</div>
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
								<Button type="submit">Criar Personagem</Button>
							</DialogFooter>
						</>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}
