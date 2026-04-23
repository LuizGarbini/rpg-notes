/**
 * Configuração por sistema de RPG.
 *
 * Define quais abas e campos do formulário de personagem devem aparecer,
 * permitindo um formulário único e dinâmico em vez de um formulário por
 * sistema. Adicionar um novo sistema é só adicionar uma entrada aqui.
 */

import type { LucideIcon } from "lucide-react";
import {
	BookHeart,
	Cog,
	Crosshair,
	Eye,
	Moon,
	Skull,
	Swords,
} from "lucide-react";
import type { RpgSystem } from "./store";
import { RPG_SYSTEMS } from "./store";

export type CharacterSection =
	| "identity"
	| "abilities"
	| "combat"
	| "personality"
	| "magic"
	| "notes"
	| "sanity";

export interface SystemConfig {
	value: RpgSystem;
	label: string;
	tagline: string;
	description: string;
	Icon: LucideIcon;
	accent: string; // tailwind text color (ex: "text-amber-300")
	bgAccent: string; // tailwind bg gradient
	sections: CharacterSection[];
	abilityLabels: [string, string, string, string, string, string]; // 6 atributos
	defaultLevel: number;
	speedUnit: string;
	showSpells: boolean;
	showSanity: boolean;
}

export const SYSTEM_CONFIG: Record<RpgSystem, SystemConfig> = {
	dnd5e: {
		value: "dnd5e",
		label: "D&D 5ª Edição",
		tagline: "Heróis e dragões",
		description:
			"Sistema d20 clássico com 6 atributos, classes, magias por slots e proficiências.",
		Icon: Swords,
		accent: "text-amber-300",
		bgAccent: "from-amber-500/15 to-rose-500/5",
		sections: ["identity", "abilities", "combat", "personality", "magic", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "SAB", "CAR"],
		defaultLevel: 1,
		speedUnit: "ft",
		showSpells: true,
		showSanity: false,
	},
	tormenta20: {
		value: "tormenta20",
		label: "Tormenta 20",
		tagline: "Arton em chamas",
		description:
			"Sistema brasileiro com 6 atributos, raças exóticas, perícias e magias.",
		Icon: Crosshair,
		accent: "text-rose-300",
		bgAccent: "from-rose-500/15 to-fuchsia-500/5",
		sections: ["identity", "abilities", "combat", "personality", "magic", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "SAB", "CAR"],
		defaultLevel: 1,
		speedUnit: "m",
		showSpells: true,
		showSanity: false,
	},
	pathfinder: {
		value: "pathfinder",
		label: "Pathfinder 2e",
		tagline: "Tática e profundidade",
		description:
			"Variante d20 com 4 graus de proficiência, 3 ações por turno e magias.",
		Icon: BookHeart,
		accent: "text-emerald-300",
		bgAccent: "from-emerald-500/15 to-cyan-500/5",
		sections: ["identity", "abilities", "combat", "personality", "magic", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "SAB", "CAR"],
		defaultLevel: 1,
		speedUnit: "ft",
		showSpells: true,
		showSanity: false,
	},
	coc: {
		value: "coc",
		label: "Call of Cthulhu",
		tagline: "Horror cósmico",
		description:
			"Investigadores frágeis enfrentando o desconhecido. Atributos % e Sanidade.",
		Icon: Eye,
		accent: "text-cyan-300",
		bgAccent: "from-cyan-500/15 to-indigo-500/5",
		sections: ["identity", "abilities", "sanity", "combat", "personality", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "POD", "APA"],
		defaultLevel: 1,
		speedUnit: "m",
		showSpells: false,
		showSanity: true,
	},
	vampire: {
		value: "vampire",
		label: "Vampiro: A Máscara",
		tagline: "Seres da noite",
		description:
			"Sistema World of Darkness, atributos por dados, disciplinas vampíricas.",
		Icon: Moon,
		accent: "text-violet-300",
		bgAccent: "from-violet-500/15 to-rose-500/5",
		sections: ["identity", "abilities", "combat", "personality", "magic", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "RAC", "APA"],
		defaultLevel: 1,
		speedUnit: "m",
		showSpells: false,
		showSanity: false,
	},
	ordem: {
		value: "ordem",
		label: "Ordem Paranormal",
		tagline: "Outro lado da realidade",
		description:
			"Sistema brasileiro de horror investigativo, com Sanidade e Esforço.",
		Icon: Skull,
		accent: "text-rose-300",
		bgAccent: "from-rose-500/15 to-zinc-500/5",
		sections: ["identity", "abilities", "sanity", "combat", "personality", "notes"],
		abilityLabels: ["FOR", "DES", "CON", "INT", "PRE", "VIG"],
		defaultLevel: 1,
		speedUnit: "m",
		showSpells: false,
		showSanity: true,
	},
	generic: {
		value: "generic",
		label: "Genérico / Outro",
		tagline: "Qualquer sistema",
		description:
			"Use os campos livres. Bom pra fichas próprias, sistemas indie ou conversão.",
		Icon: Cog,
		accent: "text-slate-300",
		bgAccent: "from-slate-500/15 to-zinc-500/5",
		sections: ["identity", "abilities", "combat", "personality", "magic", "notes"],
		abilityLabels: ["A1", "A2", "A3", "A4", "A5", "A6"],
		defaultLevel: 1,
		speedUnit: "m",
		showSpells: true,
		showSanity: false,
	},
};

export const SYSTEM_LIST = RPG_SYSTEMS.map((s) => SYSTEM_CONFIG[s.value]);
