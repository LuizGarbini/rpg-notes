import { getSupabase, SUPABASE_TABLES } from "./supabase";

export type RemoteEntityKind =
	| "character"
	| "npc"
	| "session"
	| "item"
	| "location"
	| "lore";

export type RemoteActivityAction = "create" | "update" | "delete";

export interface RemoteActivityEntry {
	id: string;
	timestamp: number;
	action: RemoteActivityAction;
	entityKind: RemoteEntityKind;
	entityId: string;
	entityName: string;
}

export interface RemoteStateSnapshot {
	characters: unknown[];
	npcs: unknown[];
	sessions: unknown[];
	items: unknown[];
	locations: unknown[];
	lores: unknown[];
	activityLog: RemoteActivityEntry[];
}

type RemoteRow = {
	id: string;
	data: unknown;
};

type ActivityRow = {
	id: string;
	action: RemoteActivityAction;
	entity_kind: RemoteEntityKind;
	entity_id: string;
	entity_name: string;
	created_at: string;
};

const TABLE_BY_KIND: Record<RemoteEntityKind, string> = {
	character: SUPABASE_TABLES.characters,
	npc: SUPABASE_TABLES.npcs,
	session: SUPABASE_TABLES.sessions,
	item: SUPABASE_TABLES.items,
	location: SUPABASE_TABLES.locations,
	lore: SUPABASE_TABLES.lores,
};

function entityNameOf(entity: Record<string, unknown>): string {
	for (const key of ["characterName", "name", "title"]) {
		const value = entity[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	return "Sem nome";
}

function rowFor(
	kind: RemoteEntityKind,
	entity: Record<string, unknown>,
): Record<string, unknown> {
	const base = {
		id: entity.id,
		name: entityNameOf(entity),
		data: entity,
	};

	switch (kind) {
		case "character":
			return { ...base, system: entity.system ?? "generic" };
		case "npc":
			return { ...base, importance: entity.importance ?? "supporting" };
		case "session":
			return {
				id: entity.id,
				title: entityNameOf(entity),
				session_number: entity.number ?? 1,
				session_date: entity.date ?? "",
				data: entity,
			};
		case "item":
			return {
				...base,
				item_type: entity.type ?? "",
				rarity: entity.rarity ?? "comum",
			};
		case "location":
			return {
				...base,
				location_type: entity.type ?? "",
				region: entity.region ?? "",
			};
		case "lore":
			return {
				id: entity.id,
				title: entityNameOf(entity),
				category: entity.category ?? "",
				importance: entity.importance ?? "supporting",
				is_secret: entity.isSecret ?? false,
				data: entity,
			};
	}
}

function requireSupabase() {
	const supabase = getSupabase();
	if (!supabase) {
		throw new Error("Supabase não está configurado.");
	}
	return supabase;
}

async function selectData(table: string): Promise<unknown[]> {
	const supabase = requireSupabase();
	const { data, error } = await supabase
		.from(table)
		.select("id, data")
		.order("updated_at", { ascending: false });

	if (error) throw error;
	return ((data ?? []) as RemoteRow[]).map((row) => row.data);
}

export async function loadRemoteState(): Promise<RemoteStateSnapshot> {
	const supabase = requireSupabase();
	const [
		characters,
		npcs,
		sessions,
		items,
		locations,
		lores,
		activityResult,
	] = await Promise.all([
		selectData(SUPABASE_TABLES.characters),
		selectData(SUPABASE_TABLES.npcs),
		selectData(SUPABASE_TABLES.sessions),
		selectData(SUPABASE_TABLES.items),
		selectData(SUPABASE_TABLES.locations),
		selectData(SUPABASE_TABLES.lores),
		supabase
			.from(SUPABASE_TABLES.activity)
			.select("id, action, entity_kind, entity_id, entity_name, created_at")
			.order("created_at", { ascending: false })
			.limit(200),
	]);

	if (activityResult.error) throw activityResult.error;

	return {
		characters,
		npcs,
		sessions,
		items,
		locations,
		lores,
		activityLog: ((activityResult.data ?? []) as ActivityRow[]).map((row) => ({
			id: row.id,
			timestamp: new Date(row.created_at).getTime(),
			action: row.action,
			entityKind: row.entity_kind,
			entityId: row.entity_id,
			entityName: row.entity_name,
		})),
	};
}

export async function createRemoteEntity<T extends { id: string }>(
	kind: RemoteEntityKind,
	entity: T,
): Promise<T> {
	const supabase = requireSupabase();
	const { error } = await supabase
		.from(TABLE_BY_KIND[kind])
		.insert(rowFor(kind, entity as Record<string, unknown>));

	if (error) throw error;
	return entity;
}

export async function updateRemoteEntity<T extends { id: string }>(
	kind: RemoteEntityKind,
	entity: T,
): Promise<T> {
	const supabase = requireSupabase();
	const { error } = await supabase
		.from(TABLE_BY_KIND[kind])
		.update(rowFor(kind, entity as Record<string, unknown>))
		.eq("id", entity.id);

	if (error) throw error;
	return entity;
}

export async function deleteRemoteEntity(
	kind: RemoteEntityKind,
	id: string,
): Promise<void> {
	const supabase = requireSupabase();
	const { error } = await supabase.from(TABLE_BY_KIND[kind]).delete().eq("id", id);
	if (error) throw error;
}

export async function createRemoteActivity(
	entry: Omit<RemoteActivityEntry, "id" | "timestamp">,
): Promise<void> {
	const supabase = requireSupabase();
	const { error } = await supabase.from(SUPABASE_TABLES.activity).insert({
		action: entry.action,
		entity_kind: entry.entityKind,
		entity_id: entry.entityId,
		entity_name: entry.entityName,
	});

	if (error) throw error;
}
