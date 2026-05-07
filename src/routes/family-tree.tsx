import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Baby,
	EyeOff,
	GitFork,
	HeartHandshake,
	Plus,
	Shield,
	Sparkles,
	Trash2,
	User,
	Users,
} from "lucide-react";
import { type ComponentType, useId, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type {
	Character,
	FamilyRelation,
	FamilyRelationKind,
} from "@/lib/store";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/family-tree")({
	component: FamilyTreePage,
});

const relationOptions: Array<{
	value: FamilyRelationKind;
	label: string;
	description: string;
}> = [
	{ value: "father", label: "Pai", description: "Relação paterna direta" },
	{ value: "mother", label: "Mãe", description: "Relação materna direta" },
	{ value: "parent", label: "Responsável", description: "Parente parental amplo" },
	{ value: "guardian", label: "Guardião", description: "Tutor ou responsável" },
	{ value: "sibling", label: "Irmão/Irmã", description: "Relação entre irmãos" },
	{ value: "child", label: "Filho/Filha", description: "Descendente direto" },
	{ value: "spouse", label: "Cônjuge", description: "Casamento ou união formal" },
	{ value: "partner", label: "Parceiro", description: "Laço afetivo importante" },
	{ value: "relative", label: "Parente", description: "Vínculo familiar genérico" },
];

const parentKinds = new Set<FamilyRelationKind>([
	"father",
	"mother",
	"parent",
	"guardian",
]);
const companionKinds = new Set<FamilyRelationKind>([
	"sibling",
	"spouse",
	"partner",
	"relative",
]);

function FamilyTreePage() {
	const characters = useRPGStore((state) => state.characters);
	const updateCharacter = useRPGStore((state) => state.updateCharacter);
	const [selectedCharacterId, setSelectedCharacterId] = useState(
		() => characters[0]?.id ?? "",
	);
	const [relatedCharacterId, setRelatedCharacterId] = useState("");
	const [relationKind, setRelationKind] =
		useState<FamilyRelationKind>("father");
	const [relationNote, setRelationNote] = useState("");
	const [isSecret, setIsSecret] = useState(false);

	const selectedCharacter =
		characters.find((character) => character.id === selectedCharacterId) ??
		characters[0];
	const characterById = useMemo(
		() => new Map(characters.map((character) => [character.id, character])),
		[characters],
	);
	const relations = selectedCharacter?.familyRelations ?? [];
	const availableCharacters = characters.filter(
		(character) => character.id !== selectedCharacter?.id,
	);
	const relationGroups = useMemo(
		() =>
			selectedCharacter
				? getRelationGroups(selectedCharacter, characters)
				: { parents: [], companions: [], children: [] },
		[selectedCharacter, characters],
	);

	function addRelation() {
		if (!selectedCharacter || !relatedCharacterId) return;
		if (relatedCharacterId === selectedCharacter.id) return;
		const existing = relations.some(
			(relation) =>
				relation.relatedCharacterId === relatedCharacterId &&
				relation.kind === relationKind,
		);
		if (existing) return;

		const nextRelation: FamilyRelation = {
			id: crypto.randomUUID(),
			relatedCharacterId,
			kind: relationKind,
			note: relationNote.trim() || undefined,
			isSecret,
		};
		updateCharacter(selectedCharacter.id, {
			familyRelations: [...relations, nextRelation],
		});
		setRelatedCharacterId("");
		setRelationNote("");
		setIsSecret(false);
	}

	function removeRelation(relationId: string) {
		if (!selectedCharacter) return;
		updateCharacter(selectedCharacter.id, {
			familyRelations: relations.filter((relation) => relation.id !== relationId),
		});
	}

	return (
		<div className="w-full">
			<PageHeader
				title="Árvore Genealógica"
				description="Mapeie pais, mães, irmãos, filhos, parceiros e segredos familiares do elenco."
				Icon={GitFork}
				iconColor="text-emerald-300"
				eyebrow="Linhagens"
				count={relations.length}
			/>

			<div className="mx-auto grid w-full max-w-7xl gap-5 px-6 pb-10 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)]">
				<aside className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5 lg:sticky lg:top-24 lg:self-start">
					<div>
						<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
							Personagem central
						</p>
						<h2 className="font-display mt-1 text-xl font-bold text-foreground">
							Selecione o foco
						</h2>
					</div>

					<div className="mt-5 space-y-4">
						<Field label="Elenco">
							<Select
								value={selectedCharacter?.id ?? ""}
								onChange={(event) => {
									setSelectedCharacterId(event.target.value);
									setRelatedCharacterId("");
								}}
							>
								{characters.map((character) => (
									<option key={character.id} value={character.id}>
										{character.characterName || "Ficha sem nome"}
									</option>
								))}
							</Select>
						</Field>

						{selectedCharacter && (
							<CharacterPortrait
								character={selectedCharacter}
								subtitle="Personagem selecionado"
							/>
						)}
					</div>

					<div className="mt-6 border-t border-border/60 pt-5">
						<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
							Novo vínculo
						</p>
						<div className="mt-4 space-y-4">
							<Field label="Parente">
								<Select
									value={relatedCharacterId}
									onChange={(event) => setRelatedCharacterId(event.target.value)}
									disabled={!selectedCharacter || availableCharacters.length === 0}
								>
									<option value="">Selecione uma ficha</option>
									{availableCharacters.map((character) => (
										<option key={character.id} value={character.id}>
											{character.characterName || "Ficha sem nome"}
										</option>
									))}
								</Select>
							</Field>

							<Field label="Tipo de relação">
								<Select
									value={relationKind}
									onChange={(event) =>
										setRelationKind(event.target.value as FamilyRelationKind)
									}
								>
									{relationOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
							</Field>

							<Field label="Nota opcional">
								<Input
									value={relationNote}
									onChange={(event) => setRelationNote(event.target.value)}
									placeholder="Ex: pai adotivo, irmã perdida..."
								/>
							</Field>

							<label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-[12px] font-medium text-muted-foreground">
								<input
									type="checkbox"
									checked={isSecret}
									onChange={(event) => setIsSecret(event.target.checked)}
									className="h-3.5 w-3.5 rounded border-border accent-primary"
								/>
								Segredo do mestre
							</label>

							<Button
								type="button"
								className="w-full gap-2"
								onClick={addRelation}
								disabled={!relatedCharacterId || !selectedCharacter}
							>
								<Plus className="h-4 w-4" />
								Vincular parente
							</Button>
						</div>
					</div>
				</aside>

				<main className="grid gap-5">
					{!selectedCharacter || characters.length === 0 ? (
						<EmptyState
							Icon={GitFork}
							title="Nenhum personagem para montar árvore"
							description="Crie fichas no elenco para começar a vincular laços familiares."
						/>
					) : (
						<>
							<section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
											Mapa familiar
										</p>
										<h2 className="font-display mt-1 text-2xl font-bold text-foreground">
											{selectedCharacter.characterName || "Ficha sem nome"}
										</h2>
										<p className="mt-1 text-[13px] text-muted-foreground">
											{relations.length} vínculo(s) direto(s), com relações
											inferidas a partir dos outros personagens.
										</p>
									</div>
									<Link
										to="/sheets/$characterId"
										params={{ characterId: selectedCharacter.id }}
									>
										<Button variant="outline" className="gap-2">
											<User className="h-4 w-4" />
											Abrir ficha
										</Button>
									</Link>
								</div>
							</section>

							<FamilyGraph
								selectedCharacter={selectedCharacter}
								groups={relationGroups}
								onRemove={removeRelation}
							/>

							<section className="grid gap-5">
								<FamilyLayer
									title="Ancestrais e responsáveis"
									description="Pais, mães, responsáveis e guardiões diretos."
									Icon={Shield}
									items={relationGroups?.parents ?? []}
									onRemove={removeRelation}
								/>

								<div className="grid gap-5 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-start">
									<FamilyLayer
										title="Irmãos e vínculos laterais"
										description="Irmãos, parceiros e parentes próximos."
										Icon={Users}
										items={relationGroups?.companions ?? []}
										onRemove={removeRelation}
									/>

									<div className="rounded-[1.75rem] border border-primary/30 bg-primary/10 p-5 shadow-lg shadow-black/5">
										<div className="flex items-center justify-center">
											<CharacterPortrait
												character={selectedCharacter}
												subtitle="Foco da árvore"
												large
											/>
										</div>
										<div className="mt-5 rounded-2xl border border-primary/20 bg-background/45 p-4">
											<div className="flex items-center gap-2 text-[12px] font-bold text-primary">
												<Sparkles className="h-4 w-4" />
												Essencial para campanha
											</div>
											<p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
												Use notas e vínculos secretos para marcar adoções,
												famílias falsas, heranças, linhagens nobres e revelações
												que ainda não apareceram na história.
											</p>
										</div>
									</div>

									<FamilyLayer
										title="Descendentes"
										description="Filhos, filhas e relações inferidas como descendentes."
										Icon={Baby}
										items={relationGroups?.children ?? []}
										onRemove={removeRelation}
									/>
								</div>

								<FamilyLayer
									title="Todos os vínculos diretos"
									description="Lista completa para revisão rápida."
									Icon={HeartHandshake}
									items={relations.map((relation) =>
										relationToItem(relation, characterById, "direct"),
									)}
									onRemove={removeRelation}
								/>
							</section>
						</>
					)}
				</main>
			</div>
		</div>
	);
}

interface FamilyItem {
	relationId: string;
	character?: Character;
	label: string;
	note?: string;
	isSecret?: boolean;
	source: "direct" | "inferred";
}

interface RelationGroups {
	parents: FamilyItem[];
	companions: FamilyItem[];
	children: FamilyItem[];
}

function getRelationGroups(
	selected: Character,
	characters: Character[],
): RelationGroups {
	const characterById = new Map(
		characters.map((character) => [character.id, character]),
	);
	const ownRelations = selected.familyRelations ?? [];
	const parents = ownRelations
		.filter((relation) => parentKinds.has(relation.kind))
		.map((relation) => relationToItem(relation, characterById, "direct"));
	const companions = ownRelations
		.filter((relation) => companionKinds.has(relation.kind))
		.map((relation) => relationToItem(relation, characterById, "direct"));
	const children = ownRelations
		.filter((relation) => relation.kind === "child")
		.map((relation) => relationToItem(relation, characterById, "direct"));

	for (const character of characters) {
		if (character.id === selected.id) continue;
		for (const relation of character.familyRelations ?? []) {
			if (relation.relatedCharacterId !== selected.id) continue;
			if (parentKinds.has(relation.kind)) {
				children.push({
					relationId: relation.id,
					character,
					label: "Filho/Filha",
					note: relation.note,
					isSecret: relation.isSecret,
					source: "inferred",
				});
			}
			if (relation.kind === "child") {
				parents.push({
					relationId: relation.id,
					character,
					label: "Pai/Mãe",
					note: relation.note,
					isSecret: relation.isSecret,
					source: "inferred",
				});
			}
			if (companionKinds.has(relation.kind)) {
				companions.push({
					relationId: relation.id,
					character,
					label: relationLabel(relation.kind),
					note: relation.note,
					isSecret: relation.isSecret,
					source: "inferred",
				});
			}
		}
	}

	return { parents, companions, children };
}

function relationToItem(
	relation: FamilyRelation,
	characterById: Map<string, Character>,
	source: "direct" | "inferred",
): FamilyItem {
	return {
		relationId: relation.id,
		character: characterById.get(relation.relatedCharacterId),
		label: relationLabel(relation.kind),
		note: relation.note,
		isSecret: relation.isSecret,
		source,
	};
}

function relationLabel(kind: FamilyRelationKind) {
	return relationOptions.find((option) => option.value === kind)?.label ?? "Parente";
}

function FamilyGraph({
	selectedCharacter,
	groups,
	onRemove,
}: {
	selectedCharacter: Character;
	groups: RelationGroups;
	onRemove: (relationId: string) => void;
}) {
	const lineGradientId = `family-tree-line-${useId().replace(/:/g, "")}`;
	const leftCompanions = groups.companions.filter((_, index) => index % 2 === 0);
	const rightCompanions = groups.companions.filter((_, index) => index % 2 === 1);
	const hasAnyRelation =
		groups.parents.length > 0 ||
		groups.companions.length > 0 ||
		groups.children.length > 0;

	return (
		<section className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm shadow-black/5">
			<div className="border-b border-border/60 p-5">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
							Grafo familiar
						</p>
						<h2 className="font-display mt-1 text-2xl font-bold text-foreground">
							Conexões entre personagens
						</h2>
						<p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
							Os cards se organizam por papel narrativo: ancestrais acima,
							laços laterais nas bordas e descendentes abaixo do foco.
						</p>
					</div>
					<span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
						{hasAnyRelation ? "Mapa ativo" : "Sem vínculos"}
					</span>
				</div>
			</div>

			<div className="overflow-x-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(135deg,rgba(74,222,128,0.08),transparent_34%),linear-gradient(225deg,rgba(168,85,247,0.07),transparent_34%)] p-4 sm:p-6">
				<div className="relative min-w-[760px] rounded-3xl border border-white/10 bg-background/35 p-6 shadow-inner shadow-black/10">
					<svg
						className="pointer-events-none absolute inset-0 h-full w-full text-primary/45"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id={lineGradientId} x1="0" x2="1" y1="0" y2="1">
								<stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
								<stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
								<stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
							</linearGradient>
						</defs>
						<path
							d="M50 20 C50 29 50 34 50 41"
							fill="none"
							stroke={`url(#${lineGradientId})`}
							strokeDasharray={groups.parents.length > 0 ? undefined : "2 2"}
							strokeLinecap="round"
							strokeWidth="0.45"
						/>
						<path
							d="M50 60 C50 68 50 74 50 82"
							fill="none"
							stroke={`url(#${lineGradientId})`}
							strokeDasharray={groups.children.length > 0 ? undefined : "2 2"}
							strokeLinecap="round"
							strokeWidth="0.45"
						/>
						<path
							d="M22 50 C33 50 39 50 44 50"
							fill="none"
							stroke={`url(#${lineGradientId})`}
							strokeDasharray={leftCompanions.length > 0 ? undefined : "2 2"}
							strokeLinecap="round"
							strokeWidth="0.45"
						/>
						<path
							d="M56 50 C62 50 69 50 80 50"
							fill="none"
							stroke={`url(#${lineGradientId})`}
							strokeDasharray={rightCompanions.length > 0 ? undefined : "2 2"}
							strokeLinecap="round"
							strokeWidth="0.45"
						/>
						<circle cx="50" cy="50" r="1.1" fill="currentColor" opacity="0.85" />
					</svg>

					<div className="relative z-10 grid min-h-[590px] grid-rows-[auto_1fr_auto] gap-8">
						<GraphCluster
							items={groups.parents}
							emptyText="Adicione pai, mãe ou responsável"
							align="center"
							onRemove={onRemove}
						/>

						<div className="grid grid-cols-[1fr_250px_1fr] items-center gap-6">
							<GraphCluster
								items={leftCompanions}
								emptyText="Irmãos e parceiros aparecem aqui"
								align="end"
								onRemove={onRemove}
							/>

							<div className="relative">
								<div className="absolute -inset-6 rounded-full bg-primary/15 blur-2xl" />
								<GraphNode
									item={{
										relationId: selectedCharacter.id,
										character: selectedCharacter,
										label: "Foco da árvore",
										source: "inferred",
									}}
									variant="center"
									onRemove={onRemove}
								/>
							</div>

							<GraphCluster
								items={rightCompanions}
								emptyText="Laços laterais extras"
								align="start"
								onRemove={onRemove}
							/>
						</div>

						<GraphCluster
							items={groups.children}
							emptyText="Adicione filhos ou descendentes"
							align="center"
							onRemove={onRemove}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function GraphCluster({
	items,
	emptyText,
	align,
	onRemove,
}: {
	items: FamilyItem[];
	emptyText: string;
	align: "start" | "center" | "end";
	onRemove: (relationId: string) => void;
}) {
	const alignClass =
		align === "center"
			? "justify-center"
			: align === "end"
				? "justify-end"
				: "justify-start";

	if (items.length === 0) {
		return (
			<div className={`flex ${alignClass}`}>
				<div className="max-w-[220px] rounded-2xl border border-dashed border-border/60 bg-card/45 px-4 py-3 text-center text-[11px] font-medium text-muted-foreground">
					{emptyText}
				</div>
			</div>
		);
	}

	return (
		<div className={`flex flex-wrap gap-3 ${alignClass}`}>
			{items.map((item, index) => (
				<GraphNode
					key={`${item.source}-${item.relationId}-${index}`}
					item={item}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
}

function GraphNode({
	item,
	variant = "default",
	onRemove,
}: {
	item: FamilyItem;
	variant?: "default" | "center";
	onRemove: (relationId: string) => void;
}) {
	const isCenter = variant === "center";

	return (
		<div
			className={`group relative overflow-hidden rounded-2xl border shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 ${
				isCenter
					? "border-primary/40 bg-primary/15 p-4"
					: "w-[210px] border-border/70 bg-card/90 p-3"
			}`}
		>
			<div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/20 via-primary to-primary/20" />
			<div className="flex items-start gap-3">
				<div
					className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/25 bg-primary/10 text-primary ${
						isCenter ? "h-14 w-14" : "h-11 w-11"
					}`}
				>
					{item.character?.imageUrl ? (
						<img
							src={item.character.imageUrl}
							alt={item.character.characterName}
							className="h-full w-full object-cover"
						/>
					) : (
						<User className={isCenter ? "h-6 w-6" : "h-4 w-4"} />
					)}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
							{item.label}
						</p>
						{item.isSecret && <EyeOff className="h-3 w-3 shrink-0 text-amber-300" />}
					</div>
					{item.character ? (
						<Link
							to="/sheets/$characterId"
							params={{ characterId: item.character.id }}
							className={`font-display mt-1 block truncate font-bold text-foreground transition-colors hover:text-primary ${
								isCenter ? "text-lg" : "text-[14px]"
							}`}
						>
							{item.character.characterName || "Ficha sem nome"}
						</Link>
					) : (
						<p className="font-display mt-1 text-[14px] font-bold text-muted-foreground">
							Ficha removida
						</p>
					)}
					{item.note && (
						<p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
							{item.note}
						</p>
					)}
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between gap-2">
				<span className="rounded-full border border-border/60 bg-background/55 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
					{item.source === "direct" ? "Direto" : "Inferido"}
				</span>
				{item.source === "direct" && (
					<button
						type="button"
						onClick={() => onRemove(item.relationId)}
						className="flex h-7 w-7 items-center justify-center rounded-xl border border-border/70 text-muted-foreground opacity-70 transition hover:border-rose-500/40 hover:text-rose-300 hover:opacity-100"
						title="Remover vínculo"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
		</div>
	);
}

function CharacterPortrait({
	character,
	subtitle,
	large,
}: {
	character: Character;
	subtitle: string;
	large?: boolean;
}) {
	return (
		<div className="flex items-center gap-3">
			<div
				className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 text-primary ${
					large ? "h-16 w-16" : "h-12 w-12"
				}`}
			>
				{character.imageUrl ? (
					<img
						src={character.imageUrl}
						alt={character.characterName}
						className="h-full w-full object-cover"
					/>
				) : (
					<User className={large ? "h-7 w-7" : "h-5 w-5"} />
				)}
			</div>
			<div className="min-w-0">
				<p
					className={`font-display truncate font-bold text-foreground ${
						large ? "text-xl" : "text-[14px]"
					}`}
				>
					{character.characterName || "Ficha sem nome"}
				</p>
				<p className="mt-0.5 truncate text-[11px] text-muted-foreground">
					{subtitle}
				</p>
			</div>
		</div>
	);
}

function FamilyLayer({
	title,
	description,
	Icon,
	items,
	onRemove,
}: {
	title: string;
	description: string;
	Icon: ComponentType<{ className?: string }>;
	items: FamilyItem[];
	onRemove: (relationId: string) => void;
}) {
	return (
		<section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5">
			<div className="mb-4 flex items-start justify-between gap-3">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
						{title}
					</p>
					<p className="mt-1 text-[12px] text-muted-foreground">{description}</p>
				</div>
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
					<Icon className="h-4 w-4" />
				</div>
			</div>

			{items.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-border/70 bg-background/35 p-4 text-[12px] text-muted-foreground">
					Nenhum vínculo registrado nesta camada.
				</div>
			) : (
				<div className="grid gap-3">
					{items.map((item) => (
						<FamilyCard key={`${item.source}-${item.relationId}`} item={item} onRemove={onRemove} />
					))}
				</div>
			)}
		</section>
	);
}

function FamilyCard({
	item,
	onRemove,
}: {
	item: FamilyItem;
	onRemove: (relationId: string) => void;
}) {
	return (
		<div className="rounded-2xl border border-border/70 bg-background/45 p-3">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
						{item.label}
					</p>
					{item.character ? (
						<Link
							to="/sheets/$characterId"
							params={{ characterId: item.character.id }}
							className="font-display mt-1 block truncate text-[15px] font-bold text-foreground transition-colors hover:text-primary"
						>
							{item.character.characterName || "Ficha sem nome"}
						</Link>
					) : (
						<p className="font-display mt-1 text-[15px] font-bold text-muted-foreground">
							Ficha removida
						</p>
					)}
				</div>
				{item.source === "direct" ? (
					<button
						type="button"
						onClick={() => onRemove(item.relationId)}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-rose-500/40 hover:text-rose-300"
						title="Remover vínculo"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</button>
				) : (
					<span className="rounded-full border border-border/70 bg-card/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
						Inferido
					</span>
				)}
			</div>
			{(item.note || item.isSecret) && (
				<div className="mt-3 flex items-start gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 text-[11px] text-muted-foreground">
					{item.isSecret && <EyeOff className="mt-0.5 h-3.5 w-3.5 text-amber-300" />}
					<span>{item.note || "Vínculo marcado como segredo do mestre."}</span>
				</div>
			)}
		</div>
	);
}
