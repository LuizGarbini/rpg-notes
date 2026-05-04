/**
 * Supabase — configuração inicial.
 *
 * IMPORTANTE: este arquivo está estruturado para "ligar" o backend
 * remoto futuramente sem precisar mexer nas chamadas de UI.
 *
 * --- Como ativar (quando quiser usar) ---
 *
 *  1. Instalar o pacote oficial:
 *
 *       npm install @supabase/supabase-js
 *
 *     (caso o npm dê erro de "Cannot read properties of null", use:
 *      `npm install @supabase/supabase-js --legacy-peer-deps`
 *      ou apague node_modules e package-lock.json e reinstale.)
 *
 *  2. Crie um projeto em https://supabase.com e copie a URL + anon key.
 *
 *  3. Preencha `.env` na raiz (já está no .gitignore):
 *
 *       VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *       VITE_SUPABASE_ANON_KEY=eyJhbGc...
 *
 *  4. Descomente o bloco `// === INICIO INTEGRAÇÃO ===` mais abaixo.
 *
 *  5. Pronto: importe `getSupabase()` onde for fazer queries.
 *     Se as variáveis não existirem, retorna null (modo offline).
 */

export interface SupabaseConfig {
	url: string;
	anonKey: string;
}

/** Lê e valida as variáveis de ambiente. Retorna null se incompletas. */
export function getSupabaseConfig(): SupabaseConfig | null {
	const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
	const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
	if (!url || !anonKey) return null;
	return { url, anonKey };
}

/**
 * Indicador de prontidão. UI pode esconder botões de "sincronizar" enquanto
 * o Supabase não estiver configurado.
 */
export function isSupabaseConfigured(): boolean {
	return getSupabaseConfig() !== null;
}

/**
 * Cliente lazy. Hoje retorna null porque a dependência não está
 * instalada — quando instalar, descomente o bloco abaixo.
 *
 * O motivo de ser lazy + null-safe é que toda a UI já pode chamar
 * `getSupabase()?.from('characters').select()` sem quebrar quando offline.
 */
const _client: unknown = null;

export async function getSupabase(): Promise<unknown> {
	const config = getSupabaseConfig();
	if (!config) return null;
	if (_client) return _client;

	// === INICIO INTEGRAÇÃO ===
	// const { createClient } = await import("@supabase/supabase-js");
	// _client = createClient(config.url, config.anonKey, {
	//   auth: {
	//     persistSession: true,
	//     autoRefreshToken: true,
	//   },
	// });
	// === FIM INTEGRAÇÃO ===

	return _client;
}

/**
 * Convenções de buckets/tabelas — espelham as entidades do store.
 * Centralizadas aqui pra evitar typos espalhados pelo código.
 */
export const SUPABASE_TABLES = {
	characters: "characters",
	npcs: "npcs",
	sessions: "sessions",
	items: "items",
	locations: "locations",
	lores: "lores",
	activity: "activity_log",
	campaigns: "campaigns",
} as const;

export const SUPABASE_BUCKETS = {
	images: "rpg-images", // bucket único para todos os uploads
} as const;
