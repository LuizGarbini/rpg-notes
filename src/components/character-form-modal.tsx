import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	ChevronLeft,
	ChevronRight,
	Shield,
	Sparkles,
	Sword,
	User,
	X,
} from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const characterSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	race: z.string().min(1, "Raça é obrigatória"),
	class: z.string().min(1, "Classe é obrigatória"),
	level: z.coerce
		.number()
		.min(1, "Nível mínimo é 1")
		.max(20, "Nível máximo é 20"),
	experience: z.coerce.number().min(0, "Experiência não pode ser negativa"),
	health: z.coerce.number().min(1, "Vida mínima é 1"),
	maxHealth: z.coerce.number().min(1, "Vida máxima mínima é 1"),
	armorClass: z.coerce
		.number()
		.min(0, "Classe de armadura não pode ser negativa"),
	initiative: z.coerce.number(),
	background: z.string().optional(),
	notes: z.string().optional(),
});

export type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CharacterFormData) => void;
}

const TOTAL_STEPS = 3;

const stepInfo = [
	{
		title: "Informações Básicas",
		description: "Defina a identidade do seu personagem",
		icon: User,
	},
	{
		title: "Nível e Experiência",
		description: "Configure a progressão do personagem",
		icon: Sparkles,
	},
	{
		title: "Atributos de Combate",
		description: "Configure os atributos de batalha",
		icon: Shield,
	},
];

export function CharacterFormModal({
	isOpen,
	onClose,
	onSubmit,
}: CharacterFormModalProps) {
	const id = useId();
	const [currentStep, setCurrentStep] = useState(1);

	const nameId = `${id}-name`;
	const raceId = `${id}-race`;
	const classId = `${id}-class`;
	const backgroundId = `${id}-background`;
	const levelId = `${id}-level`;
	const experienceId = `${id}-experience`;
	const healthId = `${id}-health`;
	const maxHealthId = `${id}-maxHealth`;
	const armorClassId = `${id}-armorClass`;
	const initiativeId = `${id}-initiative`;
	const notesId = `${id}-notes`;

	const {
		register,
		handleSubmit,
		reset,
		trigger,
		formState: { errors },
	} = useForm<CharacterFormData>({
		resolver: standardSchemaResolver(characterSchema),
		defaultValues: {
			level: 1,
			experience: 0,
			health: 10,
			maxHealth: 10,
			armorClass: 10,
			initiative: 0,
		},
	});

	const handleFormSubmit = (data: CharacterFormData) => {
		onSubmit(data);
		reset();
		setCurrentStep(1);
		onClose();
	};

	const handleClose = () => {
		reset();
		setCurrentStep(1);
		onClose();
	};

	const validateCurrentStep = async (): Promise<boolean> => {
		let fieldsToValidate: (keyof CharacterFormData)[] = [];

		switch (currentStep) {
			case 1:
				fieldsToValidate = ["name", "race", "class"];
				break;
			case 2:
				fieldsToValidate = ["level", "experience"];
				break;
			case 3:
				fieldsToValidate = ["health", "maxHealth", "armorClass", "initiative"];
				break;
		}

		return await trigger(fieldsToValidate);
	};

	const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < TOTAL_STEPS) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const goToStep = async (step: number) => {
		if (step < currentStep) {
			setCurrentStep(step);
		} else if (step > currentStep) {
			const isValid = await validateCurrentStep();
			if (isValid) {
				setCurrentStep(step);
			}
		}
	};

	if (!isOpen) return null;

	const CurrentIcon = stepInfo[currentStep - 1].icon;

	const inputClass =
		"w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				aria-label="Fechar modal"
				className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
				onClick={handleClose}
				onKeyDown={(e) => e.key === "Escape" && handleClose()}
			/>

			<div className="relative z-10 w-full max-w-lg mx-4 bg-[#1a1a1a] border border-border rounded-2xl shadow-2xl shadow-primary/10 animate-in fade-in zoom-in-95 duration-200">
				<div className="flex items-center justify-between p-6 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-primary/10 text-primary">
							<CurrentIcon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-foreground">
								{stepInfo[currentStep - 1].title}
							</h3>
							<p className="text-sm text-muted-foreground">
								{stepInfo[currentStep - 1].description}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={handleClose}
						className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="px-6 pt-4">
					<div className="flex items-center justify-between gap-2">
						{stepInfo.map((step, index) => {
							const StepIcon = step.icon;
							const stepNumber = index + 1;
							const isActive = stepNumber === currentStep;
							const isCompleted = stepNumber < currentStep;

							return (
								<button
									key={stepNumber}
									type="button"
									onClick={() => goToStep(stepNumber)}
									className={`flex-1 flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
										isActive
											? "bg-primary/20 border border-primary/40"
											: isCompleted
												? "bg-primary/5 border border-primary/20 hover:bg-primary/10"
												: "bg-background/30 border border-border hover:bg-background/50"
									}`}
								>
									<div
										className={`p-1.5 rounded-lg transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: isCompleted
													? "bg-primary/60 text-primary-foreground"
													: "bg-muted text-muted-foreground"
										}`}
									>
										<StepIcon className="h-3.5 w-3.5" />
									</div>
									<span
										className={`text-xs font-medium hidden sm:block ${
											isActive
												? "text-primary"
												: isCompleted
													? "text-primary/80"
													: "text-muted-foreground"
										}`}
									>
										{step.title}
									</span>
								</button>
							);
						})}
					</div>
					<div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
							style={{
								width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`,
							}}
						/>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="p-6 space-y-4"
				>
					{currentStep === 1 && (
						<div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
							<div className="space-y-2">
								<label
									htmlFor={nameId}
									className="text-sm font-medium text-foreground"
								>
									Nome do Personagem *
								</label>
								<input
									id={nameId}
									type="text"
									placeholder="Ex: Aragorn, Gandalf, Legolas..."
									{...register("name")}
									className={inputClass}
								/>
								{errors.name && (
									<span className="text-sm text-red-400">
										{errors.name.message}
									</span>
								)}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor={raceId}
										className="text-sm font-medium text-foreground"
									>
										Raça *
									</label>
									<input
										id={raceId}
										type="text"
										placeholder="Ex: Humano, Elfo..."
										{...register("race")}
										className={inputClass}
									/>
									{errors.race && (
										<span className="text-sm text-red-400">
											{errors.race.message}
										</span>
									)}
								</div>

								<div className="space-y-2">
									<label
										htmlFor={classId}
										className="text-sm font-medium text-foreground"
									>
										Classe *
									</label>
									<input
										id={classId}
										type="text"
										placeholder="Ex: Guerreiro..."
										{...register("class")}
										className={inputClass}
									/>
									{errors.class && (
										<span className="text-sm text-red-400">
											{errors.class.message}
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor={backgroundId}
									className="text-sm font-medium text-foreground"
								>
									Background
								</label>
								<input
									id={backgroundId}
									type="text"
									placeholder="Ex: Soldado, Nobre, Criminoso..."
									{...register("background")}
									className={inputClass}
								/>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
							<div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
								<div className="flex items-center gap-3 text-primary mb-2">
									<Sparkles className="h-5 w-5" />
									<span className="font-medium">Progressão do Personagem</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Configure o nível atual e a experiência acumulada do seu
									personagem.
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor={levelId}
										className="text-sm font-medium text-foreground"
									>
										Nível *
									</label>
									<input
										id={levelId}
										type="number"
										min={1}
										max={20}
										{...register("level", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.level && (
										<span className="text-sm text-red-400">
											{errors.level.message}
										</span>
									)}
									<p className="text-xs text-muted-foreground">De 1 a 20</p>
								</div>

								<div className="space-y-2">
									<label
										htmlFor={experienceId}
										className="text-sm font-medium text-foreground"
									>
										Experiência (XP) *
									</label>
									<input
										id={experienceId}
										type="number"
										min={0}
										{...register("experience", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.experience && (
										<span className="text-sm text-red-400">
											{errors.experience.message}
										</span>
									)}
									<p className="text-xs text-muted-foreground">
										Pontos de experiência acumulados
									</p>
								</div>
							</div>
						</div>
					)}

					{currentStep === 3 && (
						<div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
							<div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
								<div className="flex items-center gap-3 text-primary mb-2">
									<Sword className="h-5 w-5" />
									<span className="font-medium">Atributos de Combate</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Defina os atributos usados durante as batalhas.
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor={healthId}
										className="text-sm font-medium text-foreground"
									>
										Vida Atual *
									</label>
									<input
										id={healthId}
										type="number"
										min={0}
										{...register("health", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.health && (
										<span className="text-sm text-red-400">
											{errors.health.message}
										</span>
									)}
								</div>

								<div className="space-y-2">
									<label
										htmlFor={maxHealthId}
										className="text-sm font-medium text-foreground"
									>
										Vida Máxima *
									</label>
									<input
										id={maxHealthId}
										type="number"
										min={1}
										{...register("maxHealth", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.maxHealth && (
										<span className="text-sm text-red-400">
											{errors.maxHealth.message}
										</span>
									)}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor={armorClassId}
										className="text-sm font-medium text-foreground"
									>
										Classe de Armadura *
									</label>
									<input
										id={armorClassId}
										type="number"
										min={0}
										{...register("armorClass", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.armorClass && (
										<span className="text-sm text-red-400">
											{errors.armorClass.message}
										</span>
									)}
									<p className="text-xs text-muted-foreground">
										AC (Armor Class)
									</p>
								</div>

								<div className="space-y-2">
									<label
										htmlFor={initiativeId}
										className="text-sm font-medium text-foreground"
									>
										Iniciativa *
									</label>
									<input
										id={initiativeId}
										type="number"
										{...register("initiative", { valueAsNumber: true })}
										className={inputClass}
									/>
									{errors.initiative && (
										<span className="text-sm text-red-400">
											{errors.initiative.message}
										</span>
									)}
									<p className="text-xs text-muted-foreground">
										Modificador de iniciativa
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor={notesId}
									className="text-sm font-medium text-foreground"
								>
									Notas Adicionais
								</label>
								<textarea
									id={notesId}
									rows={3}
									placeholder="Anotações sobre o personagem, equipamentos, habilidades especiais..."
									{...register("notes")}
									className={`${inputClass} resize-none`}
								/>
							</div>
						</div>
					)}

					<div className="flex gap-3 pt-4">
						{currentStep > 1 ? (
							<button
								type="button"
								onClick={handlePrevious}
								className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium transition-all duration-300 hover:border-border-hover hover:text-foreground hover:bg-background/30"
							>
								<ChevronLeft className="h-4 w-4" />
								Voltar
							</button>
						) : (
							<button
								type="button"
								onClick={handleClose}
								className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium transition-all duration-300 hover:border-border-hover hover:text-foreground hover:bg-background/30"
							>
								Cancelar
							</button>
						)}

						{currentStep < TOTAL_STEPS ? (
							<button
								type="button"
								onClick={handleNext}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
							>
								Próximo
								<ChevronRight className="h-4 w-4" />
							</button>
						) : (
							<button
								type="submit"
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
							>
								<Sparkles className="h-4 w-4" />
								Criar Personagem
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
