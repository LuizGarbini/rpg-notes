import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Character {
  id: string;
  characterName: string;
  race: string;
  class: string;
  background: string;
  level: number;
  xp: number;
  health: number;
  healthMax: number;
  armorClass: number;
  initiative: number;
  createdAt: number;
}

export interface Npc {
  id: string;
  name: string;
  race: string;
  role: string;
  location: string;
  description: string;
  createdAt: number;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  summary: string;
  createdAt: number;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  stats: string;
  createdAt: number;
}

export interface GameLocation {
  id: string;
  name: string;
  type: string;
  dangerLevel: string;
  description: string;
  createdAt: number;
}

export interface Lore {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: number;
}

interface RPGState {
  characters: Character[];
  addCharacter: (character: Omit<Character, "id" | "createdAt">) => void;
  removeCharacter: (id: string) => void;

  npcs: Npc[];
  addNpc: (npc: Omit<Npc, "id" | "createdAt">) => void;
  removeNpc: (id: string) => void;

  sessions: Session[];
  addSession: (session: Omit<Session, "id" | "createdAt">) => void;
  removeSession: (id: string) => void;

  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;

  locations: GameLocation[];
  addLocation: (location: Omit<GameLocation, "id" | "createdAt">) => void;
  removeLocation: (id: string) => void;

  lores: Lore[];
  addLore: (lore: Omit<Lore, "id" | "createdAt">) => void;
  removeLore: (id: string) => void;
}

const generateEntry = <T extends object>(data: T) => ({
  ...data,
  id: crypto.randomUUID(),
  createdAt: Date.now(),
});

export const useRPGStore = create<RPGState>()(
  persist(
    (set) => ({
      characters: [],
      addCharacter: (character) =>
        set((state) => ({ characters: [...state.characters, generateEntry(character)] })),
      removeCharacter: (id) =>
        set((state) => ({ characters: state.characters.filter((c) => c.id !== id) })),

      npcs: [],
      addNpc: (npc) =>
        set((state) => ({ npcs: [...state.npcs, generateEntry(npc)] })),
      removeNpc: (id) =>
        set((state) => ({ npcs: state.npcs.filter((c) => c.id !== id) })),

      sessions: [],
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, generateEntry(session)] })),
      removeSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((c) => c.id !== id) })),

      items: [],
      addItem: (item) =>
        set((state) => ({ items: [...state.items, generateEntry(item)] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((c) => c.id !== id) })),

      locations: [],
      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, generateEntry(location)] })),
      removeLocation: (id) =>
        set((state) => ({ locations: state.locations.filter((c) => c.id !== id) })),

      lores: [],
      addLore: (lore) =>
        set((state) => ({ lores: [...state.lores, generateEntry(lore)] })),
      removeLore: (id) =>
        set((state) => ({ lores: state.lores.filter((c) => c.id !== id) })),
    }),
    {
      name: "rpg-storage", // local storage key
    }
  )
);
