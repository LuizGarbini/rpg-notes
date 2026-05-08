import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RPGState } from "./store/types";
import { createCampaignSlice } from "./store/campaign-slice";
import { createCharacterSlice } from "./store/character-slice";
import { createNpcSlice } from "./store/npc-slice";
import { createSessionSlice } from "./store/session-slice";
import { createCollectionSlice } from "./store/collection-slice";
import { createSpotifySlice } from "./store/spotify-slice";
import { createSyncSlice } from "./store/sync-slice";

// Re-export types for convenience
export * from "./store/types";
export { characterDefaults } from "./store/character-slice";
export { npcDefaults } from "./store/npc-slice";
export { sessionDefaults } from "./store/session-slice";
export { itemDefaults, locationDefaults, loreDefaults } from "./store/collection-slice";
export { abilityModifier, formatModifier, systemLabel } from "./store/helpers";

export const useRPGStore = create<RPGState>()(
	persist(
		(...a) => ({
			...createCampaignSlice(...a),
			...createCharacterSlice(...a),
			...createNpcSlice(...a),
			...createSessionSlice(...a),
			...createCollectionSlice(...a),
			...createSpotifySlice(...a),
			...createSyncSlice(...a),
		}),
		{
			name: "rpg-notes-storage",
			partialize: (state) => ({
				// Persist everything except transient loading states
				activeCampaignId: state.activeCampaignId,
				campaigns: state.campaigns,
				characters: state.characters,
				npcs: state.npcs,
				sessions: state.sessions,
				items: state.items,
				locations: state.locations,
				lores: state.lores,
				activityLog: state.activityLog,
				spotifyJamLink: state.spotifyJamLink,
				spotifyJamActive: state.spotifyJamActive,
				spotifyToken: state.spotifyToken,
				spotifyUser: state.spotifyUser,
			}),
		},
	),
);
