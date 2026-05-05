import { Coins, Gem, Link2, Weight } from "lucide-react";
import { useState } from "react";
import type { Item } from "@/lib/store";
import { useRPGStore } from "@/lib/store";
import { EntityActions } from "./entity-actions";
import { ItemEditButton } from "./item-form";

interface ItemCardProps {
	item: Item;
}

const rarityStyles: Record<
	string,
	{ tone: string; ring: string; glow: string }
> = {
	comum: {
		tone: "text-slate-300",
		ring: "ring-border",
		glow: "from-slate-500/10",
	},
	incomum: {
		tone: "text-emerald-300",
		ring: "ring-emerald-500/30",
		glow: "from-emerald-500/15",
	},
	raro: {
		tone: "text-blue-300",
		ring: "ring-blue-500/30",
		glow: "from-blue-500/15",
	},
	"muito raro": {
		tone: "text-fuchsia-300",
		ring: "ring-fuchsia-500/30",
		glow: "from-fuchsia-500/15",
	},
	lendário: {
		tone: "text-amber-300",
		ring: "ring-amber-500/30",
		glow: "from-amber-500/15",
	},
	artefato: {
		tone: "text-rose-300",
		ring: "ring-rose-500/40",
		glow: "from-rose-500/15",
	},
};

export function ItemCard({ item }: ItemCardProps) {
	const removeItem = useRPGStore((s) => s.removeItem);
	const [editOpen, setEditOpen] = useState(false);

	const rarityKey = (item.rarity || "comum").toLowerCase();
	const rarity = rarityStyles[rarityKey] ?? rarityStyles.comum;

	return (
		<>
		<div className="flex flex-col">
			<div
				className={`group relative flex flex-col rounded-xl border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover ${rarity.ring}`}
			>
				<EntityActions
					onEdit={() => setEditOpen(true)}
					onDelete={() => removeItem(item.id)}
					entityName={item.name || "Sem nome"}
					entityKindLabel="item"
				/>

				<div className="flex items-start gap-3">
					<div
						className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br ${rarity.glow} to-transparent ring-1 ${rarity.ring} ${rarity.tone}`}
					>
						{item.imageUrl ? (
							<img
								src={item.imageUrl}
								alt={item.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<Gem className="h-5 w-5" strokeWidth={1.6} />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="font-display truncate text-[15px] font-bold text-foreground">
							{item.name || "Sem nome"}
						</h3>
						<div className="mt-0.5 flex flex-wrap items-center gap-1">
							<span
								className={`rounded bg-background/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${rarity.ring} ${rarity.tone}`}
							>
								{item.rarity || "comum"}
							</span>
							{item.type && (
								<span className="text-[11px] text-muted-foreground">
									· {item.type}
								</span>
							)}
							{item.subtype && (
								<span className="text-[11px] text-muted-foreground/80">
									({item.subtype})
								</span>
							)}
						</div>
						{(item.requiresAttunement || item.equipped) && (
							<div className="mt-1 flex items-center gap-2 text-[9px] uppercase tracking-wider">
								{item.requiresAttunement && (
									<span className="flex items-center gap-0.5 text-violet-300">
										<Link2 className="h-2.5 w-2.5" /> sintonização
									</span>
								)}
								{item.equipped && (
									<span className="text-emerald-300">equipado</span>
								)}
							</div>
						)}
					</div>
				</div>

				{item.stats && (
					<p className="font-mono mt-3 line-clamp-2 rounded-md bg-background/40 p-2 text-[11px] text-foreground/90 ring-1 ring-border/60">
						{item.stats}
					</p>
				)}

				<div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px]">
					{item.weight && (
						<MiniInfo Icon={Weight} label="Peso" value={item.weight} />
					)}
					{item.value && (
						<MiniInfo Icon={Coins} label="Valor" value={item.value} />
					)}
					{item.charges && (
						<MiniInfo Icon={Gem} label="Cargas" value={item.charges} />
					)}
				</div>

				{item.description && (
					<p className="mt-3 line-clamp-2 border-t border-border/60 pt-2.5 text-[11px] italic text-muted-foreground">
						“{item.description}”
					</p>
				)}
			</div>

			<ItemEditButton
				item={item}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={null}
			/>
		</div>
		</>
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
