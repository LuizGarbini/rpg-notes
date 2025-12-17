import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { X } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const characterSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	race: z.string().min(1, "Raça é obrigatória"),
	class: z.string().min(1, "Classe é obrigatória"),
	level: z.number().min(1, "Nível mínimo é 1").max(20, "Nível máximo é 20"),
	background: z.string().optional(),
	notes: z.string().optional(),
});

export type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CharacterFormData) => void;
}

export function CharacterFormModal({
	isOpen,
	onClose,
	onSubmit,
}: CharacterFormModalProps) {
	const id = useId();
	const nameId = `${id}-name`;
	const raceId = `${id}-race`;
	const classId = `${id}-class`;
	const levelId = `${id}-level`;
	const backgroundId = `${id}-background`;
	const notesId = `${id}-notes`;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CharacterFormData>({
		resolver: standardSchemaResolver(characterSchema),
		defaultValues: {
			level: 1,
		},
	});

	const handleFormSubmit = (data: CharacterFormData) => {
		onSubmit(data);
		reset();
		onClose();
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				aria-label="Fechar modal"
				className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
				onClick={handleClose}
				onKeyDown={(e) => e.key === "Escape" && handleClose()}
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-lg mx-4 bg-[#1a1a1a] border border-border rounded-2xl shadow-2xl shadow-primary/10 animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border">
					<h3 className="text-xl font-semibold text-foreground">
						Novo Personagem
					</h3>
					<button
						type="button"
						onClick={handleClose}
						className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="p-6 space-y-4"
				>
					<div className="space-y-2">
						<label
							htmlFor={nameId}
							className="text-sm font-medium text-foreground"
						>
							Nome *
						</label>
						<input
							id={nameId}
							type="text"
							placeholder="Ex: Aragorn"
							{...register("name")}
							className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
								placeholder="Ex: Humano"
								{...register("race")}
								className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
								placeholder="Ex: Guerreiro"
								{...register("class")}
								className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							/>
							{errors.class && (
								<span className="text-sm text-red-400">
									{errors.class.message}
								</span>
							)}
						</div>
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
								className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							/>
							{errors.level && (
								<span className="text-sm text-red-400">
									{errors.level.message}
								</span>
							)}
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
								placeholder="Ex: Soldado"
								{...register("background")}
								className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor={notesId}
							className="text-sm font-medium text-foreground"
						>
							Notas
						</label>
						<textarea
							id={notesId}
							rows={3}
							placeholder="Anotações adicionais sobre o personagem..."
							{...register("notes")}
							className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/30 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium transition-all duration-300 hover:border-border-hover hover:text-foreground hover:bg-background/30"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
						>
							Criar Personagem
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
