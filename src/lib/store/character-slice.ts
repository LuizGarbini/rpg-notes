import type { StateCreator } from "zustand";
import type { Character, RPGState } from "./types";
import { generateEntry, pushLog, entityNameOf, remoteErrorMessage } from "./helpers";
import { createRemoteEntity, createRemoteActivity, updateRemoteEntity, deleteRemoteEntity } from "../remote-store";
import { createDefaultSheetLayout } from "../sheet-modules";

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
	sheetLayout: createDefaultSheetLayout("dnd5e"),
	familyRelations: [],
};

export interface CharacterSlice {
	characters: Character[];
	addCharacter: (character: Partial<Omit<Character, "id" | "createdAt">>) => Character;
	updateCharacter: (id: string, character: Partial<Character>) => void;
	removeCharacter: (id: string) => void;
}

export const createCharacterSlice: StateCreator<RPGState, [], [], CharacterSlice> = (set) => ({
	characters: [],
	addCharacter: (character) => {
		const created = generateEntry(characterDefaults, {
			...character,
			sheetLayout:
				character.sheetLayout ??
				createDefaultSheetLayout(character.system ?? characterDefaults.system),
		}) as Character;
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
});
