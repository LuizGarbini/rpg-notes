import { create } from "zustand";
import {
	createRemoteActivity,
	createRemoteEntity,
	deleteRemoteEntity,
	loadRemoteState,
	updateRemoteEntity,
} from "./remote-store";

// =====================================================
//  Sistemas suportados
// =====================================================
export const RPG_SYSTEMS = [
	{ value: "dnd5e", label: "D&D 5ª Edição (2014)" },
	{ value: "dnd2024", label: "D&D 2024" },
	{ value: "vampire", label: "Vampiro: A Máscara" },
	{ value: "coc", label: "Call of Cthulhu 7e" },
	{ value: "tormenta20", label: "Tormenta 20" },
	{ value: "ordem", label: "Ordem Paranormal" },
	{ value: "contosloop", label: "Contos do Loop" },
	{ value: "mausritter", label: "Mausritter" },
	{ value: "daggerheart", label: "Daggerheart" },
	{ value: "cyberpunkred", label: "Cyberpunk RED" },
	{ value: "fallout2d20", label: "Fallout RPG (2d20)" },
	{ value: "wilderfeast", label: "Wilderfeast" },
	{ value: "gothrpg", label: "Guerra dos Tronos RPG" },
	{ value: "cosmere", label: "Cosmere RPG" },
	{ value: "hogwarts", label: "Hogwarts: Um RPG (PbtA)" },
	{ value: "avatarlegends", label: "Avatar Legends" },
	{ value: "3det", label: "3DeT Victory" },
	{ value: "assassinscreed", label: "Assassin's Creed RPG" },
	{ value: "corespring", label: "Corespring RPG" },
	{ value: "corespringnpc", label: "Corespring — Ameaça (NPC)" },
	{ value: "melodiaperdida", label: "Melodia Perdida" },
	{ value: "olddragon2e", label: "Old Dragon 2e" },
	{ value: "skyfall", label: "Skyfall RPG" },
	{ value: "symbaroum", label: "Symbaroum" },
	{ value: "ronin", label: "Ronin RPG (Puro Osso)" },
	{ value: "duna", label: "Duna: Aventuras no Imperium" },
	{ value: "stalker", label: "STALKER RPG 2ª Edição" },
	{ value: "fissura", label: "Fissura RPG" },
	{ value: "meltedlands", label: "Melted Lands" },
	{ value: "savageworlds", label: "Savage Worlds SWADE" },
	{ value: "sacramento", label: "Sacramento RPG" },
	{ value: "somdasseis", label: "O Som das Seis" },
	{ value: "fabulaultima", label: "Fabula Ultima" },
	{ value: "ashesoftomorrow", label: "Ashes of Tomorrow" },
	{ value: "l5r5e", label: "Legend of the Five Rings 5e" },
	{ value: "weirdwizard", label: "Shadow of the Weird Wizard" },
	{ value: "demonlord", label: "Shadow of the Demon Lord" },
	{ value: "pathfinder", label: "Pathfinder 2e" },
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

export const ENTITY_LABELS: Record<
	EntityKind,
	{ singular: string; plural: string }
> = {
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
	isLoadingRemote: boolean;
	syncError: string | null;
	loadRemoteData: () => Promise<void>;
	clearLocalData: () => void;

	characters: Character[];
	addCharacter: (
		character: Partial<Omit<Character, "id" | "createdAt">>,
	) => Character;
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

function remoteErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error && "message" in error) {
		return String((error as { message: unknown }).message);
	}
	return "Falha ao sincronizar com o Supabase.";
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

export const useRPGStore = create<RPGState>()((set) => ({
	isLoadingRemote: false,
	syncError: null,
	loadRemoteData: async () => {
		set({ isLoadingRemote: true, syncError: null });
		try {
			const remote = await loadRemoteState();
			set({
				characters: remote.characters.map((c) => ({
					...characterDefaults,
					...(c as Partial<Character>),
				})) as Character[],
				npcs: remote.npcs.map((n) => ({
					...npcDefaults,
					...(n as Partial<Npc>),
				})) as Npc[],
				sessions: remote.sessions.map((s) => ({
					...sessionDefaults,
					...(s as Partial<Session>),
				})) as Session[],
				items: remote.items.map((i) => ({
					...itemDefaults,
					...(i as Partial<Item>),
				})) as Item[],
				locations: remote.locations.map((l) => ({
					...locationDefaults,
					...(l as Partial<GameLocation>),
				})) as GameLocation[],
				lores: remote.lores.map((l) => ({
					...loreDefaults,
					...(l as Partial<Lore>),
				})) as Lore[],
				activityLog: remote.activityLog as ActivityEntry[],
				isLoadingRemote: false,
			});
		} catch (error) {
			set({ isLoadingRemote: false, syncError: remoteErrorMessage(error) });
		}
	},
	clearLocalData: () =>
		set({
			characters: [],
			npcs: [],
			sessions: [],
			items: [],
			locations: [],
			lores: [],
			activityLog: [],
			syncError: null,
		}),

	// ----- Characters -----
	characters: [],
	addCharacter: (character) => {
		const created = generateEntry(characterDefaults, character) as Character;
		const log = {
			action: "create" as const,
			entityKind: "character" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			characters: [...state.characters, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("character", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateCharacter: (id, character) =>
		set((state) => {
			const existing = state.characters.find((c) => c.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...character, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "character" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("character", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				characters: state.characters.map((c) => (c.id === id ? updated : c)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeCharacter: (id) =>
		set((state) => {
			const existing = state.characters.find((c) => c.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "character" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("character", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					characters: state.characters.filter((c) => c.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- NPCs -----
	npcs: [],
	addNpc: (npc) => {
		const created = generateEntry(npcDefaults, npc) as Npc;
		const log = {
			action: "create" as const,
			entityKind: "npc" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			npcs: [...state.npcs, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("npc", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateNpc: (id, npc) =>
		set((state) => {
			const existing = state.npcs.find((n) => n.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...npc, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "npc" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("npc", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				npcs: state.npcs.map((n) => (n.id === id ? updated : n)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeNpc: (id) =>
		set((state) => {
			const existing = state.npcs.find((n) => n.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "npc" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("npc", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					npcs: state.npcs.filter((n) => n.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- Sessions -----
	sessions: [],
	addSession: (session) => {
		const created = generateEntry(sessionDefaults, session) as Session;
		const log = {
			action: "create" as const,
			entityKind: "session" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			sessions: [...state.sessions, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("session", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateSession: (id, session) =>
		set((state) => {
			const existing = state.sessions.find((s) => s.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...session, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "session" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("session", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeSession: (id) =>
		set((state) => {
			const existing = state.sessions.find((s) => s.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "session" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("session", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					sessions: state.sessions.filter((s) => s.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- Items -----
	items: [],
	addItem: (item) => {
		const created = generateEntry(itemDefaults, item) as Item;
		const log = {
			action: "create" as const,
			entityKind: "item" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			items: [...state.items, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("item", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateItem: (id, item) =>
		set((state) => {
			const existing = state.items.find((i) => i.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...item, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "item" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("item", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				items: state.items.map((i) => (i.id === id ? updated : i)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeItem: (id) =>
		set((state) => {
			const existing = state.items.find((i) => i.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "item" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("item", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					items: state.items.filter((i) => i.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- Locations -----
	locations: [],
	addLocation: (location) => {
		const created = generateEntry(locationDefaults, location) as GameLocation;
		const log = {
			action: "create" as const,
			entityKind: "location" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			locations: [...state.locations, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("location", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateLocation: (id, location) =>
		set((state) => {
			const existing = state.locations.find((l) => l.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...location, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "location" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("location", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				locations: state.locations.map((l) => (l.id === id ? updated : l)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeLocation: (id) =>
		set((state) => {
			const existing = state.locations.find((l) => l.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "location" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("location", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					locations: state.locations.filter((l) => l.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- Lores -----
	lores: [],
	addLore: (lore) => {
		const created = generateEntry(loreDefaults, lore) as Lore;
		const log = {
			action: "create" as const,
			entityKind: "lore" as const,
			entityId: created.id,
			entityName: entityNameOf(created),
		};
		set((state) => ({
			lores: [...state.lores, created],
			activityLog: pushLog(state.activityLog, log),
			syncError: null,
		}));
		void Promise.all([
			createRemoteEntity("lore", created),
			createRemoteActivity(log),
		]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
		return created;
	},
	updateLore: (id, lore) =>
		set((state) => {
			const existing = state.lores.find((l) => l.id === id);
			if (!existing) return state;
			const updated = { ...existing, ...lore, updatedAt: Date.now() };
			const log = {
				action: "update" as const,
				entityKind: "lore" as const,
				entityId: id,
				entityName: entityNameOf(updated),
			};
			void Promise.all([
				updateRemoteEntity("lore", updated),
				createRemoteActivity(log),
			]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
			return {
				lores: state.lores.map((l) => (l.id === id ? updated : l)),
				activityLog: pushLog(state.activityLog, log),
				syncError: null,
			};
		}),
	removeLore: (id) =>
		set((state) => {
			const existing = state.lores.find((l) => l.id === id);
			if (existing) {
				const log = {
					action: "delete" as const,
					entityKind: "lore" as const,
					entityId: id,
					entityName: entityNameOf(existing),
				};
				void Promise.all([
					deleteRemoteEntity("lore", id),
					createRemoteActivity(log),
				]).catch((error) => set({ syncError: remoteErrorMessage(error) }));
				return {
					lores: state.lores.filter((l) => l.id !== id),
					activityLog: pushLog(state.activityLog, log),
					syncError: null,
				};
			}
			return state;
		}),

	// ----- Activity Log -----
	activityLog: [],
	clearActivity: () => set({ activityLog: [] }),
}));

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
