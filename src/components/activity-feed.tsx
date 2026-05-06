import type { LucideIcon } from "lucide-react";
import {
	BookOpen,
	History,
	MapIcon,
	Package,
	Pencil,
	Plus,
	ScrollText,
	Trash2,
	User,
	Users,
} from "lucide-react";
import {
	type ActivityAction,
	ENTITY_LABELS,
	type EntityKind,
	useRPGStore,
} from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";

const ENTITY_ICONS: Record<EntityKind, LucideIcon> = {
	character: User,
	npc: Users,
	session: ScrollText,
	item: Package,
	location: MapIcon,
	lore: BookOpen,
};

const ENTITY_COLORS: Record<EntityKind, string> = {
	character: "text-violet-300",
	npc: "text-fuchsia-300",
	session: "text-amber-300",
	item: "text-emerald-300",
	location: "text-rose-300",
	lore: "text-indigo-300",
};

const ACTION_META: Record<
	ActivityAction,
	{ label: string; Icon: LucideIcon; color: string }
> = {
	create: { label: "criou", Icon: Plus, color: "text-emerald-300" },
	update: { label: "editou", Icon: Pencil, color: "text-amber-300" },
	delete: { label: "removeu", Icon: Trash2, color: "text-rose-300" },
};

interface ActivityFeedProps {
	limit?: number;
}

export function ActivityFeed({ limit = 8 }: ActivityFeedProps) {
	const activity = useRPGStore((s) => s.activityLog);
	const items = activity.slice(0, limit);

	return (
		<section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm shadow-black/5">
			<header className="mb-5 flex items-start justify-between gap-4">
				<div>
					<p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
						<History className="h-3.5 w-3.5 text-primary" />
						Timeline
					</p>
					<h2 className="mt-2 text-lg font-bold tracking-tight text-foreground">
						Atividade recente
					</h2>
				</div>
				{activity.length > 0 && (
					<span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
						{activity.length} eventos
					</span>
				)}
			</header>

			{items.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
					<p className="text-[13px] font-bold text-foreground">
						Nada por aqui ainda
					</p>
					<p className="mt-1 text-[12px] text-muted-foreground">
						Crie ou edite algum registro para ver o histórico.
					</p>
				</div>
			) : (
				<ol className="flex flex-col gap-3">
					{items.map((entry) => {
						const Icon = ENTITY_ICONS[entry.entityKind];
						const action = ACTION_META[entry.action];
						const ActionIcon = action.Icon;
						const entityLabel = ENTITY_LABELS[entry.entityKind].singular;
						return (
							<li
								key={entry.id}
								className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card-elevated/60 px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
							>
								<div
									className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/70 ring-1 ring-border ${ENTITY_COLORS[entry.entityKind]}`}
								>
									<Icon className="h-4 w-4" strokeWidth={1.7} />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex min-w-0 items-center gap-2 text-[12px]">
										<ActionIcon
											className={`h-3.5 w-3.5 shrink-0 ${action.color}`}
											strokeWidth={2}
										/>
										<span className="text-muted-foreground">
											{action.label}
										</span>
										<span className="text-muted-foreground/70">
											{entityLabel.toLowerCase()}
										</span>
									</div>
									<p className="mt-0.5 truncate text-[13px] font-bold text-foreground">
										{entry.entityName}
									</p>
								</div>
								<time
									dateTime={new Date(entry.timestamp).toISOString()}
									className="shrink-0 rounded-full border border-border/60 bg-background/60 px-2 py-1 font-mono text-[10px] tabular-nums text-muted-foreground"
								>
									{formatRelativeTime(entry.timestamp)}
								</time>
							</li>
						);
					})}
				</ol>
			)}
		</section>
	);
}
