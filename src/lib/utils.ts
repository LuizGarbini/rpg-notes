import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Tempo relativo curto em PT-BR ("há 2min", "há 3h", "ontem", "12/03").
 * Útil para o activity log.
 */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
	const diff = Math.max(0, now - timestamp);
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 30) return "agora";
	if (minutes < 1) return `${seconds}s`;
	if (minutes < 60) return `${minutes}min`;
	if (hours < 24) return `${hours}h`;
	if (days === 1) return "ontem";
	if (days < 7) return `${days}d`;

	return new Date(timestamp).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
	});
}
