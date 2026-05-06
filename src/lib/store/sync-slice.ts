import type { StateCreator } from "zustand";
import type { RPGState, ActivityEntry, Character, Npc, Session, Item, GameLocation, Lore } from "./types";
import { remoteErrorMessage } from "./helpers";
import { loadRemoteState } from "../remote-store";
import { getSupabase } from "../supabase";
import { characterDefaults } from "./character-slice";
import { npcDefaults } from "./npc-slice";
import { sessionDefaults } from "./session-slice";
import { itemDefaults, locationDefaults, loreDefaults } from "./collection-slice";

export interface SyncSlice {
	isLoadingRemote: boolean;
	syncError: string | null;
	activityLog: ActivityEntry[];
	loadRemoteData: () => Promise<void>;
	setupRealtime: () => () => void;
	clearLocalData: () => void;
	clearActivity: () => void;
}

export const createSyncSlice: StateCreator<RPGState, [], [], SyncSlice> = (set) => ({
	isLoadingRemote: false,
	syncError: null,
	activityLog: [],
	loadRemoteData: async () => {
		set({ isLoadingRemote: true, syncError: null });
		try {
			const remote = await loadRemoteState();
			
			// Validação defensiva básica
			const ensureArray = (val: unknown) => Array.isArray(val) ? val : [];

			set({
				characters: ensureArray(remote.characters).map((c) => ({
					...characterDefaults,
					...(c as Partial<Character>),
				})) as Character[],
				npcs: ensureArray(remote.npcs).map((n) => ({
					...npcDefaults,
					...(n as Partial<Npc>),
				})) as Npc[],
				sessions: ensureArray(remote.sessions).map((s) => ({
					...sessionDefaults,
					...(s as Partial<Session>),
				})) as Session[],
				items: ensureArray(remote.items).map((i) => ({
					...itemDefaults,
					...(i as Partial<Item>),
				})) as Item[],
				locations: ensureArray(remote.locations).map((l) => ({
					...locationDefaults,
					...(l as Partial<GameLocation>),
				})) as GameLocation[],
				lores: ensureArray(remote.lores).map((l) => ({
					...loreDefaults,
					...(l as Partial<Lore>),
				})) as Lore[],
				activityLog: ensureArray(remote.activityLog) as ActivityEntry[],
				isLoadingRemote: false,
			});
		} catch (error) {
			set({ isLoadingRemote: false, syncError: remoteErrorMessage(error) });
		}
	},
	setupRealtime: () => {
		const supabase = getSupabase();
		if (!supabase) return () => {};

		const channel = supabase
			.channel("db-changes")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public" },
				(payload) => {
					const { eventType, table, new: newRow, old: oldRow } = payload;
					
					// Mapeamento de tabelas para chaves do store
					const tableToKey: Record<string, keyof RPGState> = {
						characters: "characters",
						npcs: "npcs",
						sessions: "sessions",
						items: "items",
						locations: "locations",
						lores: "lores",
						activity_log: "activityLog",
					};

					const storeKey = tableToKey[table];
					if (!storeKey) return;

					set((state) => {
						const currentArray = state[storeKey] as any[];
						
						if (eventType === "INSERT") {
							// Evita duplicata se já foi adicionado localmente
							if (currentArray.some((item) => item.id === newRow.id)) return state;
							
							let processed = newRow.data || newRow;
							if (table === "activity_log") {
								processed = {
									id: newRow.id,
									action: newRow.action,
									entityKind: newRow.entity_kind,
									entityId: newRow.entity_id,
									entityName: newRow.entity_name,
									timestamp: new Date(newRow.created_at).getTime(),
								};
							} else {
								processed = { id: newRow.id, ...newRow.data };
							}

							return { [storeKey]: [processed, ...currentArray].slice(0, table === "activity_log" ? 200 : 1000) };
						}

						if (eventType === "UPDATE") {
							return {
								[storeKey]: currentArray.map((item) => 
									item.id === newRow.id ? { ...item, ...newRow.data } : item
								)
							};
						}

						if (eventType === "DELETE") {
							return {
								[storeKey]: currentArray.filter((item) => item.id !== oldRow.id)
							};
						}

						return state;
					});
				}
			)
			.subscribe();

		return () => {
			void supabase.removeChannel(channel);
		};
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
	clearActivity: () => set({ activityLog: [] }),
});
