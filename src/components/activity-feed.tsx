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
import { useMemo } from "react";
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

import { Skeleton } from "@/components/ui/skeleton";

interface ActivityFeedProps {
	limit?: number;
	isLoading?: boolean;
}

export function ActivityFeed({ limit = 8, isLoading }: ActivityFeedProps) {
	const activity = useRPGStore((s) => s.activityLog);
	const items = useMemo(() => activity.slice(0, limit), [activity, limit]);
	const skeletonKeys = useMemo(
		() =>
			Array.from(
				{ length: limit },
				(_, index) => `activity-skeleton-${limit}-${index}`,
			),
		[limit],
	);

	return (
		<section className="rounded-2xl border border-white/5 bg-card/30 p-8 shadow-xl ring-1 ring-white/5 backdrop-blur-md">
			<header className="mb-6 flex items-start justify-between gap-4">
				<div>
					<p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">
						<History className="h-4 w-4" />
						Timeline
					</p>
					<h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
						Atividade Recente
					</h2>
				</div>
				{!isLoading && activity.length > 0 && (
					<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
						{activity.length} eventos
					</span>
				)}
			</header>

			{isLoading ? (
				<ol className="flex flex-col gap-4">
					{skeletonKeys.map((key) => (
						<li
							key={key}
							className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3.5"
						>
							<Skeleton className="h-9 w-9 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-4 w-1/2" />
							</div>
							<Skeleton className="h-5 w-16 rounded-full" />
						</li>
					))}
				</ol>
			) : items.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center bg-white/2">
					<div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/20">
						<History className="h-6 w-6" />
					</div>
					<p className="text-[15px] font-bold text-foreground/80">
						Nada por aqui ainda
					</p>
					<p className="mt-2 text-[12px] text-muted-foreground/50 leading-relaxed font-medium">
						Crie ou edite algum registro para ver o histórico do seu mundo
						aparecer aqui.
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
								className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10 cursor-pointer"
							>
								<div
									className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/40 ring-1 ring-white/5 ${ENTITY_COLORS[entry.entityKind]} transition-transform group-hover:scale-105`}
								>
									<Icon className="h-4 w-4" strokeWidth={1.8} />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex min-w-0 items-center gap-2 text-[11px]">
										<ActionIcon
											className={`h-3.5 w-3.5 shrink-0 ${action.color}`}
											strokeWidth={2.2}
										/>
										<span className="font-bold text-muted-foreground/60 uppercase tracking-wide">
											{action.label}
										</span>
										<span className="text-muted-foreground/40 font-medium">
											{entityLabel.toLowerCase()}
										</span>
									</div>
									<p className="mt-0.5 truncate text-[14px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
										{entry.entityName}
									</p>
								</div>
								<time
									dateTime={new Date(entry.timestamp).toISOString()}
									className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] tabular-nums text-muted-foreground/50"
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
