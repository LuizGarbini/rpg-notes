import { Compass, Eye, Mountain, Users } from "lucide-react";
import { useState } from "react";
import type { GameLocation } from "@/lib/store";
import { useRPGStore } from "@/lib/store";
import { EntityActions } from "./entity-actions";
import { LocationEditButton } from "./location-form";

interface LocationCardProps {
	location: GameLocation;
}

const dangerStyles: Record<string, { tone: string; ring: string }> = {
	seguro: { tone: "text-emerald-300", ring: "ring-emerald-500/30" },
	baixo: { tone: "text-emerald-300", ring: "ring-emerald-500/20" },
	moderado: { tone: "text-amber-300", ring: "ring-amber-500/30" },
	médio: { tone: "text-amber-300", ring: "ring-amber-500/30" },
	medio: { tone: "text-amber-300", ring: "ring-amber-500/30" },
	alto: { tone: "text-orange-300", ring: "ring-orange-500/30" },
	mortal: { tone: "text-rose-300", ring: "ring-rose-500/40" },
	extremo: { tone: "text-rose-300", ring: "ring-rose-500/40" },
};

export function LocationCard({ location }: LocationCardProps) {
	const removeLocation = useRPGStore((s) => s.removeLocation);
	const [editOpen, setEditOpen] = useState(false);

	const dangerKey = (location.dangerLevel || "baixo").toLowerCase();
	const danger = dangerStyles[dangerKey] ?? dangerStyles.baixo;

	const hasImage = !!location.imageUrl;

	return (
		<div className="flex flex-col">
			<div
				className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card-elevated transition-colors hover:border-border-hover ${danger.ring}`}
			>
				<EntityActions
					onEdit={() => setEditOpen(true)}
					onDelete={() => removeLocation(location.id)}
					entityName={location.name || "Sem nome"}
					entityKindLabel="local"
				/>

				{/* Banner */}
				<div className="relative h-24 w-full shrink-0 overflow-hidden bg-linear-to-br from-emerald-500/15 via-amber-500/5 to-transparent">
					{hasImage ? (
						<img
							src={location.imageUrl}
							alt={location.name}
							className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-emerald-400/30">
							<Compass className="h-10 w-10" strokeWidth={1.4} />
						</div>
					)}
					<div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-card to-transparent" />
				</div>

				<div className="flex flex-1 flex-col p-4">
					<h3 className="font-display truncate text-[15px] font-bold text-foreground">
						{location.name || "Sem nome"}
					</h3>
					<div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
						{location.type && <span>{location.type}</span>}
						{location.region && (
							<>
								<span className="text-primary/40">·</span>
								<span>{location.region}</span>
							</>
						)}
					</div>
					<div className="mt-1.5 flex flex-wrap items-center gap-1">
						<span
							className={`rounded bg-background/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${danger.ring} ${danger.tone}`}
						>
							perigo {location.dangerLevel || "baixo"}
						</span>
						{location.visited && (
							<span className="flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary ring-1 ring-primary/20">
								<Eye className="h-2.5 w-2.5" />
								visitado
							</span>
						)}
					</div>

					<div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
						{location.climate && (
							<MiniInfo
								Icon={Mountain}
								label="Clima"
								value={location.climate}
							/>
						)}
						{location.population && (
							<MiniInfo Icon={Users} label="Pop." value={location.population} />
						)}
					</div>

					{location.description && (
						<p className="mt-3 line-clamp-3 border-t border-border/60 pt-2.5 text-[11px] italic text-muted-foreground">
							“{location.description}”
						</p>
					)}
				</div>
			</div>

			<LocationEditButton
				location={location}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={null}
			/>
		</div>
	);
}

interface MiniInfoProps {
	Icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
}

function MiniInfo({ Icon, label, value }: MiniInfoProps) {
	return (
		<div className="flex items-center gap-1.5 rounded bg-background/40 px-1.5 py-1 ring-1 ring-border/60">
			<Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
			<div className="min-w-0">
				<div className="text-[8px] uppercase tracking-wider text-muted-foreground">
					{label}
				</div>
				<div className="truncate text-[10px] font-semibold text-foreground">
					{value}
				</div>
			</div>
		</div>
	);
}
