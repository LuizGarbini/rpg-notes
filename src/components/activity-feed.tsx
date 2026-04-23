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
import type { LucideIcon } from "lucide-react";
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
		<section className="space-y-2.5">
			<header className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground heading-rule">
					<History className="h-3 w-3 text-primary" />
					Atividade recente
				</h2>
				{activity.length > 0 && (
					<span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
						{activity.length} eventos
					</span>
				)}
			</header>

			{items.length === 0 ? (
				<div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[12px] text-muted-foreground">
					Nada por aqui ainda. Crie ou edite algum registro pra ver o histórico.
				</div>
			) : (
				<ol className="flex flex-col gap-1.5">
					{items.map((entry) => {
						const Icon = ENTITY_ICONS[entry.entityKind];
						const action = ACTION_META[entry.action];
						const ActionIcon = action.Icon;
						const entityLabel = ENTITY_LABELS[entry.entityKind].singular;
						return (
							<li
								key={entry.id}
								className="group flex items-center gap-3 rounded-md border border-border/60 bg-card-elevated/40 px-3 py-2 transition-colors hover:border-border-hover"
							>
								<div
									className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background/60 ring-1 ring-border ${ENTITY_COLORS[entry.entityKind]}`}
								>
									<Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
								</div>
								<div className="flex min-w-0 flex-1 items-center gap-2 text-[12px]">
									<ActionIcon
										className={`h-3 w-3 shrink-0 ${action.color}`}
										strokeWidth={2}
									/>
									<span className="text-muted-foreground">{action.label}</span>
									<span className="text-muted-foreground/70">
										{entityLabel.toLowerCase()}
									</span>
									<span className="truncate font-medium text-foreground">
										{entry.entityName}
									</span>
								</div>
								<time
									dateTime={new Date(entry.timestamp).toISOString()}
									className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70"
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
