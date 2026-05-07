import type { StateCreator } from "zustand";
import type { Npc, RPGState } from "./types";
import { generateEntry, pushLog, entityNameOf, remoteErrorMessage } from "./helpers";
import { createRemoteEntity, createRemoteActivity, updateRemoteEntity, deleteRemoteEntity } from "../remote-store";

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
	linkedCharacterId: "",
};

export interface NpcSlice {
	npcs: Npc[];
	addNpc: (npc: Partial<Omit<Npc, "id" | "createdAt">>) => Npc;
	updateNpc: (id: string, npc: Partial<Npc>) => void;
	removeNpc: (id: string) => void;
}

export const createNpcSlice: StateCreator<RPGState, [], [], NpcSlice> = (set) => ({
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
});
