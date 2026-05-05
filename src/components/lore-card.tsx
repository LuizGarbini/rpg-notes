import { BookOpen, Lock } from "lucide-react";
import { useState } from "react";
import type { Lore } from "@/lib/store";
import { useRPGStore } from "@/lib/store";
import { EntityActions } from "./entity-actions";
import { LoreEditButton } from "./lore-form";

interface LoreCardProps {
	lore: Lore;
}

const importanceStyles: Record<
	string,
	{ tone: string; ring: string; label: string }
> = {
	minor: {
		tone: "text-muted-foreground",
		ring: "ring-border",
		label: "Curiosidade",
	},
	supporting: {
		tone: "text-foreground/80",
		ring: "ring-border",
		label: "Coadjuvante",
	},
	major: {
		tone: "text-primary",
		ring: "ring-primary/30",
		label: "Importante",
	},
	core: {
		tone: "text-amber-300",
		ring: "ring-amber-500/40",
		label: "Pilar",
	},
};

export function LoreCard({ lore }: LoreCardProps) {
	const removeLore = useRPGStore((s) => s.removeLore);
	const [editOpen, setEditOpen] = useState(false);

	const importance =
		importanceStyles[lore.importance] ?? importanceStyles.supporting;
	const tags = lore.tags
		? lore.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];

	return (
		<div className="flex flex-col">
			<div
				className={`group relative flex flex-col rounded-xl border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover ${importance.ring}`}
			>
				<EntityActions
					onEdit={() => setEditOpen(true)}
					onDelete={() => removeLore(lore.id)}
					entityName={lore.title || "Sem título"}
					entityKindLabel="lore"
				/>

				{/* "Page edge" decoration */}
				<div className="pointer-events-none absolute inset-y-3 left-0 w-[2px] rounded-full bg-linear-to-b from-transparent via-primary/40 to-transparent" />

				<div className="flex items-start gap-3 pl-2">
					<div
						className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background/40 ring-1 ${importance.ring} ${importance.tone}`}
					>
						{lore.imageUrl ? (
							<img
								src={lore.imageUrl}
								alt={lore.title}
								className="h-full w-full object-cover"
							/>
						) : (
							<BookOpen className="h-4 w-4" strokeWidth={1.6} />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1.5">
							<h3 className="font-display truncate text-[15px] font-bold text-foreground">
								{lore.title || "Sem título"}
							</h3>
							{lore.isSecret && (
								<Lock className="h-3 w-3 shrink-0 text-rose-400" />
							)}
						</div>
						<div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
							{lore.category && <span>{lore.category}</span>}
							{lore.era && (
								<>
									<span className="text-primary/40">·</span>
									<span>{lore.era}</span>
								</>
							)}
						</div>
						<div className="mt-1.5 flex flex-wrap items-center gap-1">
							<span
								className={`rounded bg-background/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${importance.ring} ${importance.tone}`}
							>
								{importance.label}
							</span>
						</div>
					</div>
				</div>

				{lore.content && (
					<p className="font-display mt-3 line-clamp-5 border-t border-border/60 pt-2.5 text-[12px] italic leading-relaxed text-foreground/85 pl-2">
						{lore.content}
					</p>
				)}

				{tags.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1 pl-2">
						{tags.slice(0, 5).map((tag) => (
							<span
								key={tag}
								className="rounded bg-muted/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground ring-1 ring-border"
							>
								#{tag}
							</span>
						))}
					</div>
				)}
			</div>

			<LoreEditButton
				lore={lore}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={null}
			/>
		</div>
	);
}
