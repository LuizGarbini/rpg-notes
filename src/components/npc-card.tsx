import { MapPin, Skull, User } from "lucide-react";
import { useState } from "react";
import type { Npc } from "@/lib/store";
import { useRPGStore } from "@/lib/store";
import { EntityActions } from "./entity-actions";
import { NpcEditButton } from "./npc-form";

interface NpcCardProps {
	npc: Npc;
}

const dispositionStyles: Record<string, { label: string; tone: string }> = {
	hostile: {
		label: "Hostil",
		tone: "text-rose-300 bg-rose-500/10 ring-rose-500/20",
	},
	unfriendly: {
		label: "Antipático",
		tone: "text-orange-300 bg-orange-500/10 ring-orange-500/20",
	},
	neutral: {
		label: "Neutro",
		tone: "text-muted-foreground bg-muted/40 ring-border",
	},
	friendly: {
		label: "Amigável",
		tone: "text-emerald-300 bg-emerald-500/10 ring-emerald-500/20",
	},
	ally: {
		label: "Aliado",
		tone: "text-sky-300 bg-sky-500/10 ring-sky-500/20",
	},
};

const importanceStyles: Record<string, string> = {
	minor: "text-muted-foreground",
	supporting: "text-foreground/80",
	major: "text-primary",
	boss: "text-rose-400",
	unknown: "text-muted-foreground",
};

export function NpcCard({ npc }: NpcCardProps) {
	const removeNpc = useRPGStore((s) => s.removeNpc);
	const [editOpen, setEditOpen] = useState(false);

	const initials = npc.name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const disposition =
		dispositionStyles[npc.disposition] ?? dispositionStyles.neutral;

	return (
		<div className="flex flex-col">
			<div className="group relative flex flex-col rounded-xl border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover">
				<EntityActions
					onEdit={() => setEditOpen(true)}
					onDelete={() => removeNpc(npc.id)}
					entityName={npc.name || "Sem nome"}
					entityKindLabel="NPC"
				/>

				<div className="flex items-start gap-3">
					<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-fuchsia-500/10 ring-1 ring-fuchsia-500/20">
						{npc.imageUrl ? (
							<img
								src={npc.imageUrl}
								alt={npc.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center text-[14px] font-bold text-fuchsia-300">
								{initials || "?"}
							</div>
						)}
						{!npc.isAlive && (
							<Skull className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-card p-0.5 text-rose-400 ring-1 ring-border" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<h3
							className={`font-display truncate text-[15px] font-bold ${importanceStyles[npc.importance]}`}
						>
							{npc.name || "Sem nome"}
						</h3>
						<p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
							<User className="h-2.5 w-2.5" /> {npc.race || "?"}{" "}
							{npc.role && <>· {npc.role}</>}
						</p>
						<div className="mt-1.5 flex flex-wrap items-center gap-1">
							<span
								className={`rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider ring-1 ${disposition.tone}`}
							>
								{disposition.label}
							</span>
							{npc.faction && (
								<span className="rounded bg-muted/50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground ring-1 ring-border">
									{npc.faction}
								</span>
							)}
							{npc.cr && (
								<span className="font-mono rounded bg-background/40 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-muted-foreground ring-1 ring-border">
									CR {npc.cr}
								</span>
							)}
						</div>
					</div>
				</div>

				{npc.location && (
					<div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<MapPin className="h-3 w-3 text-amber-300" />
						<span className="truncate">{npc.location}</span>
					</div>
				)}

				{npc.description && (
					<p className="mt-3 line-clamp-3 border-t border-border/60 pt-2.5 text-[11px] italic text-muted-foreground">
						“{npc.description}”
					</p>
				)}
			</div>

			<NpcEditButton
				npc={npc}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={null}
			/>
		</div>
	);
}
