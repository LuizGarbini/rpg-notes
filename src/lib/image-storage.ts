/**
 * Camada de abstração para armazenamento de imagens.
 *
 * Hoje usamos a impl `LocalImageStorage` que converte a imagem para
 * Data URL (base64) e devolve uma string que pode ser salva direto no
 * estado/localStorage sem nenhum backend.
 *
 * No futuro, criaremos uma `R2ImageStorage` ou `SupabaseImageStorage`
 * que faz upload pra um bucket e devolve a URL pública. O contrato
 * `ImageStorage` é o mesmo, então só trocaremos a instância exportada.
 */

export interface UploadOptions {
	/** Pasta lógica (ex: "characters", "npcs"). Útil para futuro R2/Supabase. */
	folder?: string;
	/** Limite máximo do lado maior em px. Padrão: 1024. */
	maxDimension?: number;
	/** Qualidade JPEG (0..1) usada quando convertemos. Padrão: 0.85. */
	quality?: number;
}

export interface ImageStorage {
	upload(file: File, options?: UploadOptions): Promise<string>;
	delete(url: string): Promise<void>;
}

const DEFAULT_MAX_DIMENSION = 1024;
const DEFAULT_QUALITY = 0.85;

/**
 * Lê um File e devolve um HTMLImageElement já carregado.
 */
function readFileAsImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error);
		reader.onload = () => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error("Falha ao carregar imagem."));
			img.src = String(reader.result);
		};
		reader.readAsDataURL(file);
	});
}

/**
 * Redimensiona uma imagem para `maxDimension` mantendo proporção,
 * convertendo para um Data URL JPEG/PNG.
 *
 * Isso evita guardar imagens enormes no localStorage (limite ~5MB).
 */
async function resizeToDataURL(
	file: File,
	maxDimension: number,
	quality: number,
): Promise<string> {
	const img = await readFileAsImage(file);
	const ratio = Math.min(1, maxDimension / Math.max(img.width, img.height));
	const w = Math.round(img.width * ratio);
	const h = Math.round(img.height * ratio);

	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Não foi possível inicializar canvas.");
	ctx.drawImage(img, 0, 0, w, h);

	// PNG mantém transparência; JPEG comprime melhor fotos.
	const isPng = file.type === "image/png";
	return canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality);
}

/**
 * Implementação local: converte para data URL. Não há "delete" real
 * porque o data URL vive dentro do próprio estado.
 */
export class LocalImageStorage implements ImageStorage {
	async upload(file: File, options: UploadOptions = {}): Promise<string> {
		const max = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
		const q = options.quality ?? DEFAULT_QUALITY;
		return resizeToDataURL(file, max, q);
	}

	async delete(_url: string): Promise<void> {
		// noop: a imagem está embutida no estado e some quando o estado some.
	}
}

// Singleton exportado. Quando trocarmos para R2/Supabase, só mudamos aqui.
export const imageStorage: ImageStorage = new LocalImageStorage();

/** Retorna `true` se a string parece uma URL válida ou Data URL. */
export function isImageUrl(value: string | undefined | null): boolean {
	if (!value) return false;
	return value.startsWith("data:image/") || /^https?:\/\//.test(value);
}
