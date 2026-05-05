import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	BookOpen,
	MapIcon,
	Package,
	ScrollText,
	User,
	Users,
} from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
});

const sections = [
	{
		to: "/characters",
		title: "Personagens",
		description: "Heróis da campanha",
		Icon: User,
		accent: "text-violet-300",
		key: "characters" as const,
	},
	{
		to: "/npcs",
		title: "NPCs",
		description: "Aliados, inimigos e mistérios",
		Icon: Users,
		accent: "text-fuchsia-300",
		key: "npcs" as const,
	},
	{
		to: "/sessions",
		title: "Sessões",
		description: "Crônicas das aventuras",
		Icon: ScrollText,
		accent: "text-amber-300",
		key: "sessions" as const,
	},
	{
		to: "/items",
		title: "Itens",
		description: "Tesouros e relíquias",
		Icon: Package,
		accent: "text-emerald-300",
		key: "items" as const,
	},
	{
		to: "/locations",
		title: "Locais",
		description: "Reinos e fronteiras",
		Icon: MapIcon,
		accent: "text-rose-300",
		key: "locations" as const,
	},
	{
		to: "/lore",
		title: "Lore",
		description: "História e conhecimento",
		Icon: BookOpen,
		accent: "text-indigo-300",
		key: "lores" as const,
	},
];

function Dashboard() {
	const characters = useRPGStore((s) => s.characters);
	const npcs = useRPGStore((s) => s.npcs);
	const sessions = useRPGStore((s) => s.sessions);
	const items = useRPGStore((s) => s.items);
	const locations = useRPGStore((s) => s.locations);
	const lores = useRPGStore((s) => s.lores);

	const counts = {
		characters: characters.length,
		npcs: npcs.length,
		sessions: sessions.length,
		items: items.length,
		locations: locations.length,
		lores: lores.length,
	};

	const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0);

	const lastSession = [...sessions].sort(
		(a, b) => b.createdAt - a.createdAt,
	)[0];

	return (
		<div className="w-full space-y-8 px-6 py-8">
			{/* Welcome banner */}
			<div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-background p-8 ring-1 ring-primary/10">
				<div className="relative z-10">
					<h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
						Bem-vindo ao seu <span className="text-gradient-primary">Grimório</span>
					</h1>
					<p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
						Você tem {totalEntries} registros documentados nesta campanha.
						Continue sua jornada épica.
					</p>
				</div>
				<div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
			</div>
				{/* Stat row */}
				<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
					{sections.map((s) => (
						<StatPill
							key={s.to}
							to={s.to}
							label={s.title}
							value={counts[s.key]}
							Icon={s.Icon}
							iconColor={s.accent}
						/>
					))}
				</div>

				{/* Section header */}
				<div className="flex items-center gap-3 pt-2">
					<h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground heading-rule">
						Coleções
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{sections.map((s) => (
						<DashboardCard
							key={s.to}
							to={s.to}
							title={s.title}
							description={s.description}
							Icon={s.Icon}
							iconColor={s.accent}
							count={counts[s.key]}
						/>
					))}
				</div>

				{/* Two-column: last session + activity feed */}
				<div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<ActivityFeed limit={10} />
					</div>
					<aside className="space-y-2.5">
						<h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground heading-rule">
							Última sessão
						</h2>
						{lastSession ? (
							<Link
								to="/sessions"
								className="group block rounded-lg border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<ScrollText
												className="h-3.5 w-3.5 text-amber-400"
												strokeWidth={1.7}
											/>
											<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
												{lastSession.date || "sem data"}
											</span>
										</div>
										<h3 className="font-display mt-1 text-base font-bold text-foreground">
											{lastSession.title || "Sem título"}
										</h3>
										{lastSession.summary && (
											<p className="mt-1.5 line-clamp-3 text-[12px] text-muted-foreground">
												{lastSession.summary}
											</p>
										)}
									</div>
									<ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
								</div>
							</Link>
						) : (
							<div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[12px] text-muted-foreground">
								Nenhuma sessão registrada ainda.
							</div>
						)}
					</aside>
				</div>
			</div>
	);
}

interface StatPillProps {
	to: string;
	label: string;
	value: number;
	Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
	iconColor: string;
}

function StatPill({ to, label, value, Icon, iconColor }: StatPillProps) {
	return (
		<Link
			to={to}
			className="group flex items-center justify-between rounded-md border border-border bg-card-elevated px-3 py-2.5 transition-colors hover:border-border-hover"
		>
			<div className="flex flex-col">
				<span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{label}
				</span>
				<span className="font-display text-lg font-bold leading-none text-foreground">
					{value}
				</span>
			</div>
			<Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={1.7} />
		</Link>
	);
}

interface DashboardCardProps {
	to: string;
	title: string;
	description: string;
	Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
	iconColor: string;
	count: number;
}

function DashboardCard({
	to,
	title,
	description,
	Icon,
	iconColor,
	count,
}: DashboardCardProps) {
	return (
		<Link
			to={to}
			className="group relative flex items-center justify-between gap-3 rounded-lg border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover"
		>
			<div className="flex items-center gap-3 min-w-0">
				<div
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background/60 ring-1 ring-border ${iconColor}`}
				>
					<Icon className="h-4 w-4" strokeWidth={1.7} />
				</div>
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<h3 className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
							{title}
						</h3>
						<span className="rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground ring-1 ring-border">
							{count}
						</span>
					</div>
					<p className="mt-0.5 truncate text-[12px] text-muted-foreground">
						{description}
					</p>
				</div>
			</div>

			<ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
		</Link>
	);
}
