import { Pencil, Plus } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Npc } from "@/lib/store";
import { npcDefaults, useRPGStore } from "@/lib/store";
import { ImageUploader } from "./image-uploader";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Field, FormSection, FormTabs } from "./ui/form-tabs";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

const TABS = [
	{ id: "basic", label: "Básico" },
	{ id: "personality", label: "Personalidade" },
	{ id: "secrets", label: "Segredos" },
	{ id: "stats", label: "Stats" },
];

type NpcFormValues = Omit<Npc, "id" | "createdAt" | "updatedAt">;

export function NpcForm() {
	return (
		<NpcFormDialog
			trigger={
				<Button variant="default" size="sm">
					<Plus className="h-3.5 w-3.5" />
					Novo NPC
				</Button>
			}
		/>
	);
}

interface NpcEditButtonProps {
	npc: Npc;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactNode;
}

export function NpcEditButton({
	npc,
	open,
	onOpenChange,
	trigger,
}: NpcEditButtonProps) {
	return (
		<NpcFormDialog
			npc={npc}
			open={open}
			onOpenChange={onOpenChange}
			trigger={
				trigger === undefined ? (
					<Button variant="ghost" size="sm">
						<Pencil className="h-3.5 w-3.5" />
						Editar
					</Button>
				) : (
					trigger
				)
			}
		/>
	);
}

interface NpcFormDialogProps {
	npc?: Npc;
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function NpcFormDialog({
	npc,
	trigger,
	open: openProp,
	onOpenChange,
}: NpcFormDialogProps) {
	const isEdit = !!npc;
	const [internalOpen, setInternalOpen] = useState(false);
	const open = openProp ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;

	const [tab, setTab] = useState(TABS[0].id);
	const addNpc = useRPGStore((state) => state.addNpc);
	const updateNpc = useRPGStore((state) => state.updateNpc);

	const { register, handleSubmit, reset, control, setValue } =
		useForm<NpcFormValues>({
			defaultValues: { ...npcDefaults, ...(npc ?? {}) },
		});

	const imageUrl = useWatch({ control, name: "imageUrl" });

	useEffect(() => {
		if (open) {
			reset({ ...npcDefaults, ...(npc ?? {}) });
			setTab(TABS[0].id);
		}
	}, [open, npc, reset]);

	function onSubmit(data: NpcFormValues) {
		if (isEdit && npc) updateNpc(npc.id, data);
		else addNpc(data);
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger render={trigger as React.ReactElement} />}
			<DialogContent className="!max-w-2xl max-h-[92vh] overflow-hidden p-0">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex max-h-[92vh] flex-col"
				>
					<DialogHeader className="border-b border-border px-6 pt-6 pb-4">
						<DialogTitle className="font-display text-lg">
							{isEdit ? `Editar: ${npc?.name || "NPC"}` : "Novo NPC"}
						</DialogTitle>
						<DialogDescription>
							Aliados, inimigos, mercadores — tudo o que dá vida ao mundo.
						</DialogDescription>
						<div className="mt-3">
							<FormTabs tabs={TABS} value={tab} onChange={setTab} />
						</div>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
						{tab === "basic" && (
							<FormSection title="Identidade">
								<ImageUploader
									value={imageUrl ?? ""}
									onChange={(url) =>
										setValue("imageUrl", url, { shouldDirty: true })
									}
									label="Retrato"
									folder="npcs"
									size="md"
								/>
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									<Field label="Nome" htmlFor="name">
										<Input
											id="name"
											placeholder="Ex: Bob, o Taberneiro"
											{...register("name", { required: true })}
										/>
									</Field>
									<Field label="Raça">
										<Input placeholder="Ex: Humano" {...register("race")} />
									</Field>
									<Field label="Papel / Ocupação">
										<Input placeholder="Ex: Mercador" {...register("role")} />
									</Field>
									<Field label="Localização">
										<Input
											placeholder="Ex: Vila de Vallaki"
											{...register("location")}
										/>
									</Field>
									<Field label="Facção / Organização">
										<Input
											placeholder="Ex: Guarda da Cidade"
											{...register("faction")}
										/>
									</Field>
									<Field label="Tendência">
										<Input
											placeholder="Ex: Neutro"
											{...register("alignment")}
										/>
									</Field>
									<Field label="Disposição">
										<Select {...register("disposition")}>
											<option value="hostile">Hostil</option>
											<option value="unfriendly">Antipático</option>
											<option value="neutral">Neutro</option>
											<option value="friendly">Amigável</option>
											<option value="ally">Aliado</option>
										</Select>
									</Field>
									<Field label="Importância">
										<Select {...register("importance")}>
											<option value="minor">Figurante</option>
											<option value="supporting">Coadjuvante</option>
											<option value="major">Importante</option>
											<option value="boss">Vilão / Chefe</option>
											<option value="unknown">Desconhecida</option>
										</Select>
									</Field>
									<Field label="CR / Nível">
										<Input placeholder="Ex: 1/4 ou 5" {...register("cr")} />
									</Field>
								</div>
								<Field label="Descrição">
									<Textarea
										rows={3}
										placeholder="Quem é este NPC? Como o grupo o conheceu?"
										{...register("description")}
									/>
								</Field>
							</FormSection>
						)}

						{tab === "personality" && (
							<FormSection title="Personalidade & Aparência">
								<Field label="Aparência">
									<Textarea
										rows={3}
										placeholder="Como ele se parece?"
										{...register("appearance")}
									/>
								</Field>
								<Field
									label="Tiques / Maneirismos"
									hint="Voz, sotaque, gestos..."
								>
									<Textarea
										rows={2}
										placeholder="Sempre coça o queixo antes de mentir."
										{...register("mannerisms")}
									/>
								</Field>
								<Field label="Motivações">
									<Textarea
										rows={2}
										placeholder="O que ele quer? Por quê?"
										{...register("motivations")}
									/>
								</Field>
								<Field label="Relacionamentos">
									<Textarea
										rows={2}
										placeholder="Quem ele conhece?"
										{...register("relationships")}
									/>
								</Field>
							</FormSection>
						)}

						{tab === "secrets" && (
							<FormSection
								title="Segredos do Mestre"
								description="Apenas o Mestre vê — informações reveladas conforme a campanha."
							>
								<Field label="Segredos">
									<Textarea
										rows={6}
										placeholder="Verdades ocultas, traições, planos..."
										{...register("secrets")}
									/>
								</Field>
							</FormSection>
						)}

						{tab === "stats" && (
							<FormSection
								title="Bloco de Stats"
								description="Cole ou descreva o stat block do NPC se for relevante para combate."
							>
								<Field label="Stats / Atributos">
									<Textarea
										rows={8}
										placeholder={
											"FOR 14 (+2)  DES 12 (+1)  CON 14 (+2)\nINT 10 (+0)  SAB 11 (+0)  CAR 16 (+3)\nCA 15 — HP 27 — Ataques: ..."
										}
										{...register("stats")}
										className="font-mono text-[12px]"
									/>
								</Field>
							</FormSection>
						)}
					</div>

					<div className="flex items-center justify-between gap-2 border-t border-border bg-card-elevated/40 px-6 py-3">
						<label className="flex items-center gap-2 text-[12px] text-muted-foreground">
							<input
								type="checkbox"
								className="h-3.5 w-3.5 rounded border-border accent-primary"
								{...register("isAlive")}
							/>
							NPC está vivo
						</label>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" size="sm">
								{isEdit ? "Salvar alterações" : "Salvar NPC"}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
