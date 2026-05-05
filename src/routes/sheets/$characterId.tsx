import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	abilityModifier,
	type Character,
	formatModifier,
	systemLabel,
	useRPGStore,
} from "@/lib/store";
import { SYSTEM_CONFIG, type SystemConfig } from "@/lib/systems";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	BookOpen,
	ChevronDown,
	ChevronUp,
	Edit,
	Eye,
	Globe,
	Heart,
	Package,
	ScrollText,
	Shield,
	Sparkles,
	Star,
	Swords,
	User,
	Zap,
} from "lucide-react";
import { useCallback, useId, useState } from "react";

export const Route = createFileRoute("/sheets/$characterId")({
	component: CharacterSheetPage,
});

type SheetTab = "geral" | "combate" | "inventario" | "notas" | "editar";

const TABS: {
	id: SheetTab;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
}[] = [
	{ id: "geral", label: "Geral", Icon: BookOpen },
	{ id: "combate", label: "Combate", Icon: Swords },
	{ id: "inventario", label: "Inventário", Icon: Package },
	{ id: "notas", label: "Notas", Icon: ScrollText },
	{ id: "editar", label: "Editar", Icon: Edit },
];

function CharacterSheetPage() {
	const { characterId } = Route.useParams();
	const character = useRPGStore((s) =>
		s.characters.find((c) => c.id === characterId),
	);
	const [activeTab, setActiveTab] = useState<SheetTab>("geral");
	const updateCharacter = useRPGStore((s) => s.updateCharacter);
	const update = useCallback(
		(patch: Partial<Character>) => updateCharacter(characterId, patch),
		[updateCharacter, characterId],
	);

	if (!character) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4">
				<User className="h-16 w-16 text-muted-foreground/30" />
				<h2 className="font-display text-lg text-muted-foreground">
					Personagem não encontrado
				</h2>
				<Link to="/characters">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="h-3.5 w-3.5" />
						Voltar para Fichas
					</Button>
				</Link>
			</div>
		);
	}

	const config = SYSTEM_CONFIG[character.system] ?? SYSTEM_CONFIG.generic;
	const hpPercent = character.healthMax
		? Math.min(100, Math.round((character.health / character.healthMax) * 100))
		: 0;

	const abilities = [
		{ label: config.abilityLabels[0], value: character.strength },
		{ label: config.abilityLabels[1], value: character.dexterity },
		{ label: config.abilityLabels[2], value: character.constitution },
		{ label: config.abilityLabels[3], value: character.intelligence },
		{ label: config.abilityLabels[4], value: character.wisdom },
		{ label: config.abilityLabels[5], value: character.charisma },
	];

	const passivePerception = 10 + abilityModifier(character.wisdom);
	const passiveInvestigation = 10 + abilityModifier(character.intelligence);
	const passiveInsight = 10 + abilityModifier(character.wisdom);

	return (
		<div className="w-full">
			{/* ===== HEADER ===== */}
			<div className="border-b border-border bg-card-elevated/40">
				<div className="px-6 py-5">
					<div className="flex items-start gap-4">
						{/* Avatar */}
						<div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 via-fuchsia-500/10 to-transparent ring-1 ring-border overflow-hidden">
							{character.imageUrl ? (
								<img
									src={character.imageUrl}
									alt={character.characterName}
									className="h-full w-full object-cover"
								/>
							) : (
								<User className="h-7 w-7 text-primary/40" strokeWidth={1.4} />
							)}
							<button
								type="button"
								className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
								title="Trocar avatar"
							>
								<Edit className="h-4 w-4 text-white" />
							</button>
						</div>

						{/* Info */}
						<div className="min-w-0 flex-1">
							<h1 className="font-display text-xl font-bold text-foreground truncate">
								{character.characterName || "Sem nome"}
							</h1>
							<div className="mt-1 flex flex-wrap items-center gap-1.5">
								{character.race && (
									<span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/20">
										{character.race}
									</span>
								)}
								{character.class && (
									<span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-border">
										{character.class} {character.level}
									</span>
								)}
								{!character.race && !character.class && (
									<span className="text-[11px] text-muted-foreground">
										{systemLabel(character.system)}
									</span>
								)}
							</div>
						</div>

						{/* Level & PB */}
						<div className="flex items-center gap-3 shrink-0">
							<div className="flex flex-col items-center">
								<span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
									Nível
								</span>
								<span className="font-display text-2xl font-extrabold text-foreground leading-none">
									{character.level}
								</span>
							</div>
							<div className="h-8 w-px bg-border" />
							<div className="flex flex-col items-center">
								<span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
									PB
								</span>
								<span className="font-mono text-lg font-bold text-primary leading-none">
									{formatModifier(character.proficiencyBonus)}
								</span>
							</div>
						</div>
					</div>

					{/* Quick stats bar */}
					<div className="mt-4 grid grid-cols-4 gap-2">
						<QuickStat
							label="PV"
							value={`${character.health}/${character.healthMax}`}
							color="text-rose-400"
							bgColor="bg-rose-500/10"
						/>
						<QuickStat
							label="CA"
							value={String(character.armorClass)}
							color="text-blue-400"
							bgColor="bg-blue-500/10"
						/>
						<QuickStat
							label="INIT"
							value={formatModifier(character.initiative)}
							color="text-amber-400"
							bgColor="bg-amber-500/10"
						/>
						<QuickStat
							label="MOV"
							value={`${character.speed}${config.speedUnit}`}
							color="text-emerald-400"
							bgColor="bg-emerald-500/10"
						/>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-0 px-6 overflow-x-auto">
					{TABS.map((tab) => {
						const active = tab.id === activeTab;
						const isEdit = tab.id === "editar";
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[12px] font-medium transition-colors whitespace-nowrap ${
									active
										? isEdit
											? "border-emerald-400 text-emerald-400"
											: "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
								}`}
							>
								<tab.Icon className="h-3.5 w-3.5" />
								{tab.label}
							</button>
						);
					})}
				</div>
			</div>

			{/* ===== TAB CONTENT ===== */}
			<div className="px-6 py-6 space-y-6">
				{activeTab === "geral" && (
					<>
						{/* Inspiration */}
						<div className="flex items-center justify-center rounded-lg border border-border bg-card-elevated/40 px-4 py-3">
							<Sparkles className="mr-2 h-4 w-4 text-amber-400" />
							<span className="text-[13px] text-muted-foreground">
								Sem Inspiração
							</span>
						</div>

						{/* Attributes */}
						<SheetSection title="Atributos">
							<div className="grid grid-cols-3 gap-2">
								{abilities.map((a) => {
									const mod = abilityModifier(a.value);
									return (
										<div
											key={a.label}
											className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card-elevated/40 px-4 py-4"
										>
											<span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400">
												{a.label}
											</span>
											<span className="font-display text-2xl font-extrabold text-foreground leading-none">
												{a.value}
											</span>
											<span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
												{formatModifier(mod)}
											</span>
										</div>
									);
								})}
							</div>
						</SheetSection>

						{/* Combat quick stats */}
						<SheetSection title="Combate">
							<div className="grid grid-cols-4 gap-2">
								<StatBlock
									icon={<Shield className="h-4 w-4 text-blue-400" />}
									value={String(character.armorClass)}
									label="CA"
								/>
								<StatBlock
									icon={<Zap className="h-4 w-4 text-amber-400" />}
									value={formatModifier(character.initiative)}
									label="INIT"
								/>
								<StatBlock
									icon={<Sparkles className="h-4 w-4 text-emerald-400" />}
									value={`${character.speed}${config.speedUnit}`}
									label="MOV"
								/>
								<StatBlock
									icon={<Heart className="h-4 w-4 text-violet-400" />}
									value={formatModifier(character.proficiencyBonus)}
									label="PB"
								/>
							</div>
						</SheetSection>

						{/* Passive Senses */}
						<SheetSection title="Sentidos Passivos">
							<div className="grid grid-cols-3 gap-2">
								<StatBlock
									icon={<Eye className="h-4 w-4 text-muted-foreground" />}
									value={String(passivePerception)}
									label="Percepção"
								/>
								<StatBlock
									icon={<Eye className="h-4 w-4 text-muted-foreground" />}
									value={String(passiveInvestigation)}
									label="Investigação"
								/>
								<StatBlock
									icon={<Eye className="h-4 w-4 text-muted-foreground" />}
									value={String(passiveInsight)}
									label="Intuição"
								/>
							</div>
						</SheetSection>

						{/* HP */}
						<SheetSection title="Pontos de Vida">
							<div className="rounded-lg border border-border bg-card-elevated/40 p-4">
								<div className="flex items-end justify-between">
									<div className="flex items-baseline gap-1">
										<span className="font-display text-4xl font-extrabold text-rose-400 leading-none">
											{character.health}
										</span>
										<span className="text-lg text-muted-foreground">
											/{character.healthMax}
										</span>
									</div>
									<span className="text-[11px] text-muted-foreground">
										Max: {character.healthMax}
									</span>
								</div>
								<div className="mt-3 relative h-2 overflow-hidden rounded-full bg-muted">
									<div
										className="absolute inset-y-0 left-0 rounded-full bg-rose-400 transition-all duration-500"
										style={{ width: `${hpPercent}%` }}
									/>
								</div>
								{character.tempHealth > 0 && (
									<p className="mt-2 text-[11px] text-cyan-400">
										+{character.tempHealth} HP temporário
									</p>
								)}
							</div>
						</SheetSection>

						{/* Proficiencies */}
						{(character.savingThrows ||
							character.skills ||
							character.languages) && (
							<SheetSection title="Proficiências">
								<div className="space-y-3">
									{character.savingThrows && (
										<InfoRow
											label="Salvaguardas"
											value={character.savingThrows}
										/>
									)}
									{character.skills && (
										<InfoRow label="Perícias" value={character.skills} />
									)}
									{character.languages && (
										<InfoRow label="Idiomas" value={character.languages} />
									)}
									{character.proficiencies && (
										<InfoRow label="Outras" value={character.proficiencies} />
									)}
								</div>
							</SheetSection>
						)}

						{/* Personality */}
						{(character.personalityTraits ||
							character.ideals ||
							character.bonds ||
							character.flaws) && (
							<SheetSection title="Personalidade">
								<div className="space-y-3">
									{character.personalityTraits && (
										<InfoRow
											label="Traços"
											value={character.personalityTraits}
										/>
									)}
									{character.ideals && (
										<InfoRow label="Ideais" value={character.ideals} />
									)}
									{character.bonds && (
										<InfoRow label="Vínculos" value={character.bonds} />
									)}
									{character.flaws && (
										<InfoRow label="Defeitos" value={character.flaws} />
									)}
								</div>
							</SheetSection>
						)}
					</>
				)}

				{activeTab === "combate" && (
					<>
						<SheetSection title="Status de Combate">
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								<StatBlock
									icon={<Heart className="h-4 w-4 text-rose-400" />}
									value={`${character.health}/${character.healthMax}`}
									label="HP"
								/>
								<StatBlock
									icon={<Shield className="h-4 w-4 text-blue-400" />}
									value={String(character.armorClass)}
									label="CA"
								/>
								<StatBlock
									icon={<Zap className="h-4 w-4 text-amber-400" />}
									value={formatModifier(character.initiative)}
									label="Iniciativa"
								/>
								<StatBlock
									icon={<Sparkles className="h-4 w-4 text-emerald-400" />}
									value={`${character.speed}${config.speedUnit}`}
									label="Deslocamento"
								/>
							</div>
						</SheetSection>
						{character.hitDice && (
							<SheetSection title="Dados de Vida">
								<div className="rounded-lg border border-border bg-card-elevated/40 p-4 text-center">
									<span className="font-mono text-lg font-bold text-foreground">
										{character.hitDice}
									</span>
								</div>
							</SheetSection>
						)}
					</>
				)}

				{activeTab === "inventario" && (
					<>
						{character.equipment && (
							<SheetSection title="Equipamento">
								<div className="rounded-lg border border-border bg-card-elevated/40 p-4">
									<p className="text-[13px] text-foreground/90 whitespace-pre-wrap">
										{character.equipment}
									</p>
								</div>
							</SheetSection>
						)}
						{character.currency && (
							<SheetSection title="Moedas / Tesouro">
								<div className="rounded-lg border border-border bg-card-elevated/40 p-4">
									<p className="text-[13px] text-foreground/90">
										{character.currency}
									</p>
								</div>
							</SheetSection>
						)}
						{config.showSpells && character.spells && (
							<SheetSection title="Magias">
								<div className="rounded-lg border border-border bg-card-elevated/40 p-4">
									<p className="text-[13px] text-foreground/90 whitespace-pre-wrap">
										{character.spells}
									</p>
								</div>
							</SheetSection>
						)}
						{!character.equipment &&
							!character.currency &&
							!character.spells && (
								<div className="text-center py-12 text-muted-foreground text-[13px]">
									Nenhum equipamento registrado ainda.
								</div>
							)}
					</>
				)}

				{activeTab === "notas" && (
					<SheetSection title="Anotações">
						{character.notes ? (
							<div className="rounded-lg border border-border bg-card-elevated/40 p-4">
								<p className="text-[13px] text-foreground/90 whitespace-pre-wrap">
									{character.notes}
								</p>
							</div>
						) : (
							<div className="text-center py-12 text-muted-foreground text-[13px]">
								Nenhuma anotação ainda. Use a aba Editar para adicionar.
							</div>
						)}
					</SheetSection>
				)}

				{activeTab === "editar" && (
					<InlineEditTab
						character={character}
						update={update}
						config={config}
					/>
				)}
			</div>
		</div>
	);
}

// =====================================================
//  Sub-components
// =====================================================

function QuickStat({
	label,
	value,
	color,
	bgColor,
}: {
	label: string;
	value: string;
	color: string;
	bgColor: string;
}) {
	return (
		<div
			className={`flex flex-col items-center gap-0.5 rounded-lg ${bgColor} py-2.5 ring-1 ring-border`}
		>
			<span className={`font-mono text-base font-bold ${color} leading-none`}>
				{value}
			</span>
			<span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
				{label}
			</span>
		</div>
	);
}

function SheetSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section>
			<h3 className="mb-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70 heading-rule">
				{title}
			</h3>
			{children}
		</section>
	);
}

function StatBlock({
	icon,
	value,
	label,
}: {
	icon: React.ReactNode;
	value: string;
	label: string;
}) {
	return (
		<div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card-elevated/40 py-4">
			{icon}
			<span className="font-display text-xl font-extrabold text-foreground leading-none">
				{value}
			</span>
			<span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
				{label}
			</span>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-card-elevated/40 px-4 py-3">
			<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
				{label}
			</span>
			<p className="mt-1 text-[13px] text-foreground/90">{value}</p>
		</div>
	);
}

// =====================================================
//  Accordion section for edit tab
// =====================================================

function AccordionSection({
	icon,
	title,
	badge,
	children,
	defaultOpen = false,
}: {
	icon: React.ReactNode;
	title: string;
	badge?: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="border-b border-border/60">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-card-elevated/30"
			>
				<span className="text-emerald-400">{icon}</span>
				<span className="flex-1 text-[13px] font-semibold text-foreground">
					{title}
				</span>
				{badge && (
					<span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
						{badge}
					</span>
				)}
				{open ? (
					<ChevronUp className="h-4 w-4 text-muted-foreground" />
				) : (
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				)}
			</button>
			{open && <div className="px-4 pb-4 space-y-3">{children}</div>}
		</div>
	);
}

function EditField({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
}: {
	label: string;
	value: string | number;
	onChange: (v: string) => void;
	type?: "text" | "number" | "textarea";
	placeholder?: string;
}) {
	const inputId = useId();

	return (
		<div className="space-y-1">
			<label
				htmlFor={inputId}
				className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground"
			>
				{label}
			</label>
			{type === "textarea" ? (
				<Textarea
					id={inputId}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="min-h-[80px] text-[13px]"
				/>
			) : (
				<Input
					id={inputId}
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="h-9 text-[13px]"
				/>
			)}
		</div>
	);
}

// =====================================================
//  Inline Edit Tab
// =====================================================

function InlineEditTab({
	character,
	update,
	config,
}: {
	character: Character;
	update: (patch: Partial<Character>) => void;
	config: SystemConfig;
}) {
	return (
		<div className="space-y-0 rounded-lg border border-border overflow-hidden">
			{/* Identidade */}
			<AccordionSection
				icon={<User className="h-4 w-4" />}
				title="Identidade"
				defaultOpen
			>
				<EditField
					label="Nome do Personagem"
					value={character.characterName}
					onChange={(v) => update({ characterName: v })}
					placeholder="Nome do personagem"
				/>
				<div className="grid grid-cols-2 gap-3">
					<EditField
						label="Alinhamento"
						value={character.alignment}
						onChange={(v) => update({ alignment: v })}
						placeholder="Neutro"
					/>
					<EditField
						label="Pontos de XP"
						value={character.xp}
						onChange={(v) => update({ xp: Number(v) || 0 })}
						type="number"
					/>
				</div>
			</AccordionSection>

			{/* Espécie / Raça */}
			<AccordionSection
				icon={<Sparkles className="h-4 w-4" />}
				title="Espécie"
				badge={character.race || undefined}
			>
				<EditField
					label="Raça / Espécie"
					value={character.race}
					onChange={(v) => update({ race: v })}
					placeholder="Ex: Humano, Elfo, Anão"
				/>
			</AccordionSection>

			{/* Antecedente */}
			<AccordionSection
				icon={<ScrollText className="h-4 w-4" />}
				title="Antecedente & Talento de Origem"
				badge={character.background || undefined}
			>
				<EditField
					label="Antecedente"
					value={character.background}
					onChange={(v) => update({ background: v })}
					placeholder="Ex: Sábio, Soldado, Criminoso"
				/>
			</AccordionSection>

			{/* Classe */}
			<AccordionSection
				icon={<Swords className="h-4 w-4" />}
				title="Classes"
				badge={character.class ? `Nv ${character.level}` : undefined}
			>
				<EditField
					label="Classe"
					value={character.class}
					onChange={(v) => update({ class: v })}
					placeholder="Ex: Guerreiro, Mago, Ladino"
				/>
				<EditField
					label="Subclasse"
					value={character.subclass}
					onChange={(v) => update({ subclass: v })}
					placeholder="Ex: Campeão, Escola de Evocação"
				/>
				<div className="space-y-1">
					<span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
						Nível
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								update({ level: Math.max(1, character.level - 1) })
							}
							className="h-8 w-8 p-0"
						>
							<ChevronDown className="h-4 w-4" />
						</Button>
						<span className="font-display text-2xl font-extrabold text-foreground w-8 text-center">
							{character.level}
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => update({ level: character.level + 1 })}
							className="h-8 w-8 p-0"
						>
							<ChevronUp className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</AccordionSection>

			{/* Saving Throws */}
			<AccordionSection
				icon={<Shield className="h-4 w-4" />}
				title="Testes de Resistência"
			>
				<EditField
					label="Salvaguardas"
					value={character.savingThrows}
					onChange={(v) => update({ savingThrows: v })}
					placeholder="Ex: Força, Constituição"
				/>
			</AccordionSection>

			{/* Skills */}
			<AccordionSection
				icon={<Star className="h-4 w-4" />}
				title="Proficiências em Perícias"
				badge={
					character.skills
						? `${character.skills.split(",").length} ativas`
						: undefined
				}
			>
				<EditField
					label="Perícias"
					value={character.skills}
					onChange={(v) => update({ skills: v })}
					type="textarea"
					placeholder="Ex: Atletismo, Percepção, Furtividade"
				/>
			</AccordionSection>

			{/* Speed */}
			<AccordionSection icon={<Zap className="h-4 w-4" />} title="Deslocamento">
				<EditField
					label={`Deslocamento (${config.speedUnit})`}
					value={character.speed}
					onChange={(v) => update({ speed: Number(v) || 0 })}
					type="number"
				/>
			</AccordionSection>

			{/* Armor Class */}
			<AccordionSection
				icon={<Shield className="h-4 w-4" />}
				title="Classe de Armadura"
			>
				<EditField
					label="CA"
					value={character.armorClass}
					onChange={(v) => update({ armorClass: Number(v) || 0 })}
					type="number"
				/>
			</AccordionSection>

			{/* Languages */}
			<AccordionSection
				icon={<Globe className="h-4 w-4" />}
				title="Idiomas"
				badge={
					character.languages
						? String(character.languages.split(",").length)
						: undefined
				}
			>
				<EditField
					label="Idiomas"
					value={character.languages}
					onChange={(v) => update({ languages: v })}
					placeholder="Ex: Comum, Élfico, Anão"
				/>
			</AccordionSection>

			{/* Proficiencies */}
			<AccordionSection
				icon={<Package className="h-4 w-4" />}
				title="Proficiências de Equipamento"
			>
				<EditField
					label="Proficiências"
					value={character.proficiencies}
					onChange={(v) => update({ proficiencies: v })}
					type="textarea"
					placeholder="Ex: Armaduras leves, Armas simples"
				/>
			</AccordionSection>

			{/* Notes */}
			<AccordionSection icon={<Edit className="h-4 w-4" />} title="Notas">
				<EditField
					label="Anotações"
					value={character.notes}
					onChange={(v) => update({ notes: v })}
					type="textarea"
					placeholder="Anotações livres sobre o personagem..."
				/>
			</AccordionSection>
		</div>
	);
}
