import { create } from "zustand";
import { persist } from "zustand/middleware";

// =====================================================
//  Sistemas suportados
// =====================================================
export const RPG_SYSTEMS = [
	{ value: "dnd5e", label: "D&D 5ª Edição" },
	{ value: "tormenta20", label: "Tormenta 20" },
	{ value: "pathfinder", label: "Pathfinder 2e" },
	{ value: "coc", label: "Call of Cthulhu" },
	{ value: "vampire", label: "Vampiro: A Máscara" },
	{ value: "ordem", label: "Ordem Paranormal" },
	{ value: "generic", label: "Genérico / Outro" },
] as const;

export type RpgSystem = (typeof RPG_SYSTEMS)[number]["value"];

// =====================================================
//  Tipos de entidade (usados em logs e ações genéricas)
// =====================================================
export type EntityKind =
	| "character"
	| "npc"
	| "session"
	| "item"
	| "location"
	| "lore";

export const ENTITY_LABELS: Record<EntityKind, { singular: string; plural: string }> = {
	character: { singular: "Personagem", plural: "Personagens" },
	npc: { singular: "NPC", plural: "NPCs" },
	session: { singular: "Sessão", plural: "Sessões" },
	item: { singular: "Item", plural: "Itens" },
	location: { singular: "Local", plural: "Locais" },
	lore: { singular: "Lore", plural: "Lore" },
};

// =====================================================
//  Activity log
// =====================================================
export type ActivityAction = "create" | "update" | "delete";

export interface ActivityEntry {
	id: string;
	timestamp: number;
	action: ActivityAction;
	entityKind: EntityKind;
	entityId: string;
	entityName: string;
}

const MAX_ACTIVITY = 200;

// =====================================================
//  Character — ficha completa
// =====================================================
export interface Character {
	id: string;
	createdAt: number;
	updatedAt?: number;

	system: RpgSystem;

	characterName: string;
	playerName: string;
	race: string;
	class: string;
	subclass: string;
	background: string;
	alignment: string;
	level: number;
	xp: number;

	age: string;
	height: string;
	weight: string;
	eyes: string;
	hair: string;
	skin: string;
	appearance: string;

	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;

	power: number;
	size: number;
	education: number;
	sanity: number;
	sanityMax: number;

	health: number;
	healthMax: number;
	tempHealth: number;
	armorClass: number;
	initiative: number;
	speed: number;
	proficiencyBonus: number;
	hitDice: string;
	deathSaves: { successes: number; failures: number };

	savingThrows: string;
	skills: string;
	languages: string;
	proficiencies: string;

	spellcastingClass: string;
	spellAbility: string;
	spellSaveDc: number;
	spellAttackBonus: number;
	spells: string;
	spellSlots: string;

	equipment: string;
	currency: string;

	personalityTraits: string;
	ideals: string;
	bonds: string;
	flaws: string;

	notes: string;

	imageUrl: string;
}

// =====================================================
//  NPC
// =====================================================
export interface Npc {
	id: string;
	createdAt: number;
	updatedAt?: number;

	name: string;
	race: string;
	role: string;
	location: string;
	faction: string;
	alignment: string;
	disposition: string;
	importance: "minor" | "supporting" | "major" | "boss" | "unknown";
	cr: string;

	appearance: string;
	mannerisms: string;
	motivations: string;
	secrets: string;
	relationships: string;

	stats: string;
	description: string;

	imageUrl: string;
	isAlive: boolean;
}

// =====================================================
//  Session
// =====================================================
export interface Session {
	id: string;
	createdAt: number;
	updatedAt?: number;

	title: string;
	number: number;
	date: string;
	inGameDate: string;
	duration: string;
	location: string;

	attendees: string;
	npcsPresent: string;
	locationsVisited: string;

	summary: string;
	keyEvents: string;
	combatLog: string;
	loot: string;
	xpAwarded: string;
	cliffhanger: string;

	dmNotes: string;
	mood: string;
}

// =====================================================
//  Item
// =====================================================
export interface Item {
	id: string;
	createdAt: number;
	updatedAt?: number;

	name: string;
	type: string;
	rarity: string;
	subtype: string;

	weight: string;
	value: string;
	requiresAttunement: boolean;
	attunedTo: string;
	charges: string;
	source: string;

	stats: string;
	properties: string;
	description: string;
	owner: string;

	imageUrl: string;
	equipped: boolean;
}

// =====================================================
//  Location
// =====================================================
export interface GameLocation {
	id: string;
	createdAt: number;
	updatedAt?: number;

	name: string;
	type: string;
	region: string;
	parentLocation: string;
	dangerLevel: string;

	climate: string;
	terrain: string;
	population: string;
	government: string;
	economy: string;
	notableInhabitants: string;
	keyFeatures: string;
	hooks: string;
	history: string;

	description: string;
	imageUrl: string;
	mapUrl: string;
	visited: boolean;
}

// =====================================================
//  Lore
// =====================================================
export interface Lore {
	id: string;
	createdAt: number;
	updatedAt?: number;

	title: string;
	category: string;
	era: string;
	importance: "minor" | "supporting" | "major" | "core";

	tags: string;
	relatedEntities: string;
	source: string;
	knownBy: string;

	content: string;
	notes: string;
	isSecret: boolean;

	imageUrl: string;
}

// =====================================================
//  Defaults
// =====================================================
export const characterDefaults: Omit<Character, "id" | "createdAt"> = {
	system: "dnd5e",
	characterName: "",
	playerName: "",
	race: "",
	class: "",
	subclass: "",
	background: "",
	alignment: "",
	level: 1,
	xp: 0,
	age: "",
	height: "",
	weight: "",
	eyes: "",
	hair: "",
	skin: "",
	appearance: "",
	strength: 10,
	dexterity: 10,
	constitution: 10,
	intelligence: 10,
	wisdom: 10,
	charisma: 10,
	power: 10,
	size: 10,
	education: 10,
	sanity: 0,
	sanityMax: 0,
	health: 10,
	healthMax: 10,
	tempHealth: 0,
	armorClass: 10,
	initiative: 0,
	speed: 9,
	proficiencyBonus: 2,
	hitDice: "",
	deathSaves: { successes: 0, failures: 0 },
	savingThrows: "",
	skills: "",
	languages: "",
	proficiencies: "",
	spellcastingClass: "",
	spellAbility: "",
	spellSaveDc: 0,
	spellAttackBonus: 0,
	spells: "",
	spellSlots: "",
	equipment: "",
	currency: "",
	personalityTraits: "",
	ideals: "",
	bonds: "",
	flaws: "",
	notes: "",
	imageUrl: "",
};

export const npcDefaults: Omit<Npc, "id" | "createdAt"> = {
	name: "",
	race: "",
	role: "",
	location: "",
	faction: "",
	alignment: "",
	disposition: "neutral",
	importance: "supporting",
	cr: "",
	appearance: "",
	mannerisms: "",
	motivations: "",
	secrets: "",
	relationships: "",
	stats: "",
	description: "",
	imageUrl: "",
	isAlive: true,
};

export const sessionDefaults: Omit<Session, "id" | "createdAt"> = {
	title: "",
	number: 1,
	date: "",
	inGameDate: "",
	duration: "",
	location: "",
	attendees: "",
	npcsPresent: "",
	locationsVisited: "",
	summary: "",
	keyEvents: "",
	combatLog: "",
	loot: "",
	xpAwarded: "",
	cliffhanger: "",
	dmNotes: "",
	mood: "",
};

export const itemDefaults: Omit<Item, "id" | "createdAt"> = {
	name: "",
	type: "",
	rarity: "comum",
	subtype: "",
	weight: "",
	value: "",
	requiresAttunement: false,
	attunedTo: "",
	charges: "",
	source: "",
	stats: "",
	properties: "",
	description: "",
	owner: "",
	imageUrl: "",
	equipped: false,
};

export const locationDefaults: Omit<GameLocation, "id" | "createdAt"> = {
	name: "",
	type: "",
	region: "",
	parentLocation: "",
	dangerLevel: "baixo",
	climate: "",
	terrain: "",
	population: "",
	government: "",
	economy: "",
	notableInhabitants: "",
	keyFeatures: "",
	hooks: "",
	history: "",
	description: "",
	imageUrl: "",
	mapUrl: "",
	visited: false,
};

export const loreDefaults: Omit<Lore, "id" | "createdAt"> = {
	title: "",
	category: "",
	era: "",
	importance: "supporting",
	tags: "",
	relatedEntities: "",
	source: "",
	knownBy: "",
	content: "",
	notes: "",
	isSecret: false,
	imageUrl: "",
};

// =====================================================
//  Store
// =====================================================
interface RPGState {
	characters: Character[];
	addCharacter: (character: Partial<Omit<Character, "id" | "createdAt">>) => Character;
	updateCharacter: (id: string, character: Partial<Character>) => void;
	removeCharacter: (id: string) => void;

	npcs: Npc[];
	addNpc: (npc: Partial<Omit<Npc, "id" | "createdAt">>) => Npc;
	updateNpc: (id: string, npc: Partial<Npc>) => void;
	removeNpc: (id: string) => void;

	sessions: Session[];
	addSession: (session: Partial<Omit<Session, "id" | "createdAt">>) => Session;
	updateSession: (id: string, session: Partial<Session>) => void;
	removeSession: (id: string) => void;

	items: Item[];
	addItem: (item: Partial<Omit<Item, "id" | "createdAt">>) => Item;
	updateItem: (id: string, item: Partial<Item>) => void;
	removeItem: (id: string) => void;

	locations: GameLocation[];
	addLocation: (
		location: Partial<Omit<GameLocation, "id" | "createdAt">>,
	) => GameLocation;
	updateLocation: (id: string, location: Partial<GameLocation>) => void;
	removeLocation: (id: string) => void;

	lores: Lore[];
	addLore: (lore: Partial<Omit<Lore, "id" | "createdAt">>) => Lore;
	updateLore: (id: string, lore: Partial<Lore>) => void;
	removeLore: (id: string) => void;

	activityLog: ActivityEntry[];
	clearActivity: () => void;
}

const generateEntry = <T extends object>(
	defaults: T,
	data: Partial<T>,
): T & { id: string; createdAt: number } => ({
	...defaults,
	...data,
	id: crypto.randomUUID(),
	createdAt: Date.now(),
});

// Helper para empilhar uma entrada de log limitando ao máximo
function pushLog(
	log: ActivityEntry[],
	entry: Omit<ActivityEntry, "id" | "timestamp">,
): ActivityEntry[] {
	const next: ActivityEntry = {
		...entry,
		id: crypto.randomUUID(),
		timestamp: Date.now(),
	};
	return [next, ...log].slice(0, MAX_ACTIVITY);
}

// Pega um nome amigável de qualquer entidade (vários campos possíveis)
function entityNameOf(e: object, fallback = "Sem nome"): string {
	const o = e as Record<string, unknown>;
	const candidates = [o.characterName, o.name, o.title];
	for (const c of candidates) {
		if (typeof c === "string" && c.trim()) return c.trim();
	}
	return fallback;
}

export const useRPGStore = create<RPGState>()(
	persist(
		(set, get) => ({
			// ----- Characters -----
			characters: [],
			addCharacter: (character) => {
				const created = generateEntry(characterDefaults, character) as Character;
				set((state) => ({
					characters: [...state.characters, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "character",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateCharacter: (id, character) =>
				set((state) => {
					const existing = state.characters.find((c) => c.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...character, updatedAt: Date.now() };
					return {
						characters: state.characters.map((c) =>
							c.id === id ? updated : c,
						),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "character",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeCharacter: (id) =>
				set((state) => {
					const existing = state.characters.find((c) => c.id === id);
					return {
						characters: state.characters.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "character",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- NPCs -----
			npcs: [],
			addNpc: (npc) => {
				const created = generateEntry(npcDefaults, npc) as Npc;
				set((state) => ({
					npcs: [...state.npcs, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "npc",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateNpc: (id, npc) =>
				set((state) => {
					const existing = state.npcs.find((n) => n.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...npc, updatedAt: Date.now() };
					return {
						npcs: state.npcs.map((n) => (n.id === id ? updated : n)),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "npc",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeNpc: (id) =>
				set((state) => {
					const existing = state.npcs.find((n) => n.id === id);
					return {
						npcs: state.npcs.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "npc",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- Sessions -----
			sessions: [],
			addSession: (session) => {
				const created = generateEntry(sessionDefaults, session) as Session;
				set((state) => ({
					sessions: [...state.sessions, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "session",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateSession: (id, session) =>
				set((state) => {
					const existing = state.sessions.find((s) => s.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...session, updatedAt: Date.now() };
					return {
						sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "session",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeSession: (id) =>
				set((state) => {
					const existing = state.sessions.find((s) => s.id === id);
					return {
						sessions: state.sessions.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "session",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- Items -----
			items: [],
			addItem: (item) => {
				const created = generateEntry(itemDefaults, item) as Item;
				set((state) => ({
					items: [...state.items, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "item",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateItem: (id, item) =>
				set((state) => {
					const existing = state.items.find((i) => i.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...item, updatedAt: Date.now() };
					return {
						items: state.items.map((i) => (i.id === id ? updated : i)),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "item",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeItem: (id) =>
				set((state) => {
					const existing = state.items.find((i) => i.id === id);
					return {
						items: state.items.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "item",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- Locations -----
			locations: [],
			addLocation: (location) => {
				const created = generateEntry(locationDefaults, location) as GameLocation;
				set((state) => ({
					locations: [...state.locations, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "location",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateLocation: (id, location) =>
				set((state) => {
					const existing = state.locations.find((l) => l.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...location, updatedAt: Date.now() };
					return {
						locations: state.locations.map((l) =>
							l.id === id ? updated : l,
						),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "location",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeLocation: (id) =>
				set((state) => {
					const existing = state.locations.find((l) => l.id === id);
					return {
						locations: state.locations.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "location",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- Lores -----
			lores: [],
			addLore: (lore) => {
				const created = generateEntry(loreDefaults, lore) as Lore;
				set((state) => ({
					lores: [...state.lores, created],
					activityLog: pushLog(state.activityLog, {
						action: "create",
						entityKind: "lore",
						entityId: created.id,
						entityName: entityNameOf(created),
					}),
				}));
				return created;
			},
			updateLore: (id, lore) =>
				set((state) => {
					const existing = state.lores.find((l) => l.id === id);
					if (!existing) return state;
					const updated = { ...existing, ...lore, updatedAt: Date.now() };
					return {
						lores: state.lores.map((l) => (l.id === id ? updated : l)),
						activityLog: pushLog(state.activityLog, {
							action: "update",
							entityKind: "lore",
							entityId: id,
							entityName: entityNameOf(updated),
						}),
					};
				}),
			removeLore: (id) =>
				set((state) => {
					const existing = state.lores.find((l) => l.id === id);
					return {
						lores: state.lores.filter((c) => c.id !== id),
						activityLog: existing
							? pushLog(state.activityLog, {
									action: "delete",
									entityKind: "lore",
									entityId: id,
									entityName: entityNameOf(existing),
								})
							: state.activityLog,
					};
				}),

			// ----- Activity Log -----
			activityLog: [],
			clearActivity: () => set({ activityLog: [] }),

			// expose for typings only
			_getState: () => get(),
		}),
		{
			name: "rpg-storage",
			version: 3,
			migrate: (persistedState: unknown, version) => {
				if (!persistedState || typeof persistedState !== "object") {
					return persistedState as RPGState;
				}
				const old = persistedState as Partial<RPGState>;

				if (version < 2) {
					// v1 -> v2 já feita anteriormente; mantemos backfill defensivo
				}

				// v2 -> v3: garante activityLog e campos novos (lore.imageUrl)
				return {
					...old,
					characters: (old.characters ?? []).map((c) => ({
						...characterDefaults,
						...c,
					})) as Character[],
					npcs: (old.npcs ?? []).map((n) => ({ ...npcDefaults, ...n })) as Npc[],
					sessions: (old.sessions ?? []).map((s) => ({
						...sessionDefaults,
						...s,
					})) as Session[],
					items: (old.items ?? []).map((i) => ({ ...itemDefaults, ...i })) as Item[],
					locations: (old.locations ?? []).map((l) => ({
						...locationDefaults,
						...l,
					})) as GameLocation[],
					lores: (old.lores ?? []).map((l) => ({ ...loreDefaults, ...l })) as Lore[],
					activityLog: old.activityLog ?? [],
				} as RPGState;
			},
		},
	),
);

// =====================================================
//  Helpers
// =====================================================
export function abilityModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
	return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function systemLabel(system: RpgSystem): string {
	return RPG_SYSTEMS.find((s) => s.value === system)?.label ?? "Genérico";
}
