import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	BookOpen,
	CalendarDays,
	Clock3,
	MapIcon,
	Package,
	ScrollText,
	User,
	Users,
	type LucideIcon,
	ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { ActivityFeed } from "@/components/activity-feed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRPGStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
});

const sections = [
	{
		to: "/characters",
		title: "Elenco",
		description: "Visão narrativa",
		Icon: User,
		accent: "text-violet-300",
		tint: "bg-violet-500/10 border-violet-500/20",
		key: "characters" as const,
	},
	{
		to: "/npcs",
		title: "NPCs",
		description: "Aliados, inimigos e mistérios",
		Icon: Users,
		accent: "text-fuchsia-300",
		tint: "bg-fuchsia-500/10 border-fuchsia-500/20",
		key: "npcs" as const,
	},
	{
		to: "/sessions",
		title: "Sessões",
		description: "Crônicas das aventuras",
		Icon: ScrollText,
		accent: "text-amber-300",
		tint: "bg-amber-500/10 border-amber-500/20",
		key: "sessions" as const,
	},
	{
		to: "/items",
		title: "Itens",
		description: "Tesouros e relíquias",
		Icon: Package,
		accent: "text-emerald-300",
		tint: "bg-emerald-500/10 border-emerald-500/20",
		key: "items" as const,
	},
	{
		to: "/locations",
		title: "Locais",
		description: "Reinos e fronteiras",
		Icon: MapIcon,
		accent: "text-rose-300",
		tint: "bg-rose-500/10 border-rose-500/20",
		key: "locations" as const,
	},
	{
		to: "/lore",
		title: "Lore",
		description: "História e conhecimento",
		Icon: BookOpen,
		accent: "text-indigo-300",
		tint: "bg-indigo-500/10 border-indigo-500/20",
		key: "lores" as const,
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 }
};

function Dashboard() {
	const characters = useRPGStore((s) => s.characters);
	const npcs = useRPGStore((s) => s.npcs);
	const sessions = useRPGStore((s) => s.sessions);
	const items = useRPGStore((s) => s.items);
	const locations = useRPGStore((s) => s.locations);
	const lores = useRPGStore((s) => s.lores);
	const activityLog = useRPGStore((s) => s.activityLog);
	const isLoading = useRPGStore((s) => s.isLoadingRemote);

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
	const lastActivity = activityLog[0];

	return (
		<motion.div 
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-8"
		>
			<motion.section 
				variants={itemVariants}
				className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-card/40 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5 sm:p-12"
			>
				<div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_340px] lg:items-center">
					<div className="max-w-3xl">
						<div className="flex items-center gap-2 mb-6">
							<div className="h-px w-8 bg-primary/40" />
							<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
								Visão geral do Reino
							</span>
						</div>
						<h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
							Seu épico em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400">foco.</span>
						</h1>
						<p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground/80 font-medium">
							Acompanhe os registros principais, retome a última sessão e acesse
							as coleções que mantêm o seu mundo organizado e vivo.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link to="/sheets/new">
								<Button className="h-11 gap-2 px-5 font-bold">
									<User className="h-4 w-4" />
									Criar ficha
								</Button>
							</Link>
							<Link to="/sessions">
								<Button variant="outline" className="h-12 gap-3 px-8 font-bold border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
									<ScrollText className="h-4 w-4" />
									Registrar Sessão
								</Button>
							</Link>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
						<MetricCard
							label="Registros"
							value={totalEntries}
							description="entradas no grimório"
							Icon={BookOpen}
							isLoading={isLoading}
						/>
						<MetricCard
							label="Atividades"
							value={activityLog.length}
							description={
								lastActivity
									? `última ${formatRelativeTime(lastActivity.timestamp)}`
									: "sem histórico"
							}
							Icon={Clock3}
							isLoading={isLoading}
						/>
						<MetricCard
							label="Crônicas"
							value={sessions.length}
							description={
								lastSession
									? lastSession.title || "última sem título"
									: "nenhuma registrada"
							}
							Icon={ScrollText}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</motion.section>

			<motion.section 
				variants={itemVariants}
				className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
			>
				{sections.map((section) => (
					<StatPill
						key={section.to}
						to={section.to}
						label={section.title}
						value={counts[section.key]}
						Icon={section.Icon}
						iconColor={section.accent}
						isLoading={isLoading}
					/>
				))}
			</motion.section>

			<motion.section 
				variants={itemVariants}
				className="space-y-6"
			>
				<SectionHeading
					eyebrow="Explorar Coleções"
					title="Mantenha o mundo em movimento"
					description="Acesse rapidamente personagens, sessões, itens e os detalhes que compõem o seu cenário."
				/>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
					{sections.map((section) => (
						<DashboardCard
							key={section.to}
							to={section.to}
							title={section.title}
							description={section.description}
							Icon={section.Icon}
							iconColor={section.accent}
							tint={section.tint}
							count={counts[section.key]}
							isLoading={isLoading}
						/>
					))}
				</div>
			</motion.section>

			<motion.section 
				variants={itemVariants}
				className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]"
			>
				<ActivityFeed limit={10} isLoading={isLoading} />
				<LastSessionCard lastSession={lastSession} isLoading={isLoading} />
			</motion.section>
		</motion.div>
	);
}

interface StatPillProps {
	to: string;
	label: string;
	value: number;
	Icon: LucideIcon;
	iconColor: string;
	isLoading?: boolean;
}

function StatPill({ to, label, value, Icon, iconColor, isLoading }: StatPillProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-card/30 p-4 shadow-sm ring-1 ring-white/5 backdrop-blur-sm">
				<Skeleton className="h-10 w-10 rounded-xl" />
				<div className="flex flex-col items-center gap-1 w-full">
					<Skeleton className="h-6 w-8" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>
		);
	}

	return (
		<Link
			to={to}
			className="group flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-card/30 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card/50 hover:shadow-xl hover:shadow-primary/10 ring-1 ring-white/5 backdrop-blur-sm cursor-pointer"
		>
			<div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-background/40 ${iconColor} transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary`}>
				<Icon className="h-5 w-5" strokeWidth={2} />
			</div>
			<div className="text-center">
				<span className="font-display text-2xl font-bold leading-none text-foreground tracking-tight transition-colors group-hover:text-primary">
					{value}
				</span>
				<p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
					{label}
				</p>
			</div>
		</Link>
	);
}

interface DashboardCardProps {
	to: string;
	title: string;
	description: string;
	Icon: LucideIcon;
	iconColor: string;
	tint: string;
	count: number;
	isLoading?: boolean;
}

function DashboardCard({
	to,
	title,
	description,
	Icon,
	iconColor,
	tint,
	count,
	isLoading,
}: DashboardCardProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col rounded-3xl border border-white/5 bg-card/30 p-7 shadow-sm ring-1 ring-white/5 backdrop-blur-md">
				<div className="flex items-start justify-between gap-4">
					<Skeleton className="h-12 w-12 rounded-2xl" />
					<div className="text-right flex flex-col items-end gap-1">
						<Skeleton className="h-10 w-12" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
				<div className="mt-8 flex-1 space-y-3">
					<Skeleton className="h-6 w-3/4" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
					</div>
				</div>
				<div className="mt-8 border-t border-white/5 pt-5">
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		);
	}

	return (
		<Link
			to={to}
			className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-card/30 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-card/50 hover:shadow-2xl hover:shadow-black/20 ring-1 ring-white/5 backdrop-blur-md cursor-pointer"
		>
			{/* Hover Glow Shine */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			<div className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
			
			<div className="flex items-start justify-between gap-4">
				<div
					className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 ${tint} ${iconColor} shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:brightness-125 group-hover:bg-primary/20`}
				>
					<Icon className="h-6 w-6" strokeWidth={1.8} />
				</div>
				<div className="text-right">
					<div className="font-display text-4xl font-bold leading-none text-foreground tracking-tight transition-colors group-hover:text-primary">
						{count}
					</div>
					<p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
						registros
					</p>
				</div>
			</div>

			<div className="mt-8 flex-1">
				<h3 className="text-[17px] font-bold text-foreground transition-colors group-hover:text-primary tracking-tight">
					{title}
				</h3>
				<p className="mt-2 text-[13px] leading-relaxed text-muted-foreground/70 font-medium">
					{description}
				</p>
			</div>

			<div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5 text-[12px] font-bold text-primary group/link">
				<span className="tracking-tight">Abrir Coleção</span>
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover/link:translate-x-1 group-hover/link:bg-primary/20">
					<ChevronRight className="h-3.5 w-3.5" />
				</div>
			</div>
		</Link>
	);
}

function MetricCard({
	label,
	value,
	description,
	Icon,
	isLoading,
}: {
	label: string;
	value: number;
	description: string;
	Icon: LucideIcon;
	isLoading?: boolean;
}) {
	if (isLoading) {
		return (
			<div className="rounded-[1.5rem] border border-white/5 bg-white/5 p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-md">
				<div className="flex items-center justify-between gap-3 mb-4">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-8 w-8 rounded-lg" />
				</div>
				<Skeleton className="h-10 w-16 mb-2" />
				<Skeleton className="h-3 w-32" />
			</div>
		);
	}

	return (
		<div className="group relative cursor-pointer rounded-[1.5rem] border border-white/5 bg-white/5 p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/10 hover:border-primary/30 hover:shadow-xl hover:shadow-black/20">
			{/* Shine Effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
			
			<div className="flex items-center justify-between gap-3 mb-4">
				<span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors group-hover:text-primary/70">
					{label}
				</span>
				<div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:brightness-125 group-hover:bg-primary/20">
					<Icon className="h-4 w-4" strokeWidth={2.2} />
				</div>
			</div>
			<div className="font-display text-3xl font-bold leading-none text-foreground tracking-tight transition-all duration-300 group-hover:text-primary group-hover:scale-[1.02]">
				{value}
			</div>
			<p className="mt-2 truncate text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider">
				{description}
			</p>
		</div>
	);
}

function SectionHeading({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string;
	title: string;
	description: string;
}) {
	return (
		<div className="flex max-w-2xl flex-col gap-2">
			<div className="flex items-center gap-2">
				<div className="h-px w-6 bg-primary/40" />
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
					{eyebrow}
				</p>
			</div>
			<h2 className="text-3xl font-bold tracking-tight text-foreground/90">
				{title}
			</h2>
			<p className="text-[14px] leading-relaxed text-muted-foreground/60 font-medium">
				{description}
			</p>
		</div>
	);
}

function LastSessionCard({
	lastSession,
	isLoading,
}: {
	lastSession:
		| {
				title: string;
				date: string;
				summary: string;
				createdAt: number;
		  }
		| undefined;
	isLoading?: boolean;
}) {
	if (isLoading) {
		return (
			<aside className="rounded-[2rem] border border-white/5 bg-card/30 p-8 shadow-xl ring-1 ring-white/5 backdrop-blur-md">
				<div className="mb-6 flex items-center justify-between gap-3">
					<div className="space-y-2">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-8 w-40" />
					</div>
					<Skeleton className="h-12 w-12 rounded-2xl" />
				</div>
				<div className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-7 w-3/4" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				</div>
			</aside>
		);
	}

	return (
		<aside className="rounded-[2rem] border border-white/5 bg-card/30 p-8 shadow-xl ring-1 ring-white/5 backdrop-blur-md">
			<div className="mb-6 flex items-center justify-between gap-3">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">
						Crônicas
					</p>
					<h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
						Última Sessão
					</h2>
				</div>
				<div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
					<CalendarDays className="h-6 w-6" strokeWidth={1.8} />
				</div>
			</div>

			{lastSession ? (
				<Link
					to="/sessions"
					className="group block relative rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white/10 cursor-pointer"
				>
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0">
							<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
								{lastSession.date || "Sem data registrada"}
							</p>
							<h3 className="font-display text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
								{lastSession.title || "Sem título"}
							</h3>
						</div>
						<div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
							<ArrowUpRight className="h-4 w-4" />
						</div>
					</div>
					<p className="mt-4 line-clamp-5 text-[13px] leading-relaxed text-muted-foreground/70 font-medium italic border-l-2 border-white/10 pl-4">
						{lastSession.summary || "Ainda não há um resumo arcano para esta sessão."}
					</p>
				</Link>
			) : (
				<div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center bg-white/2 cursor-default transition-colors hover:bg-white/5">
					<div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
						<ScrollText className="h-6 w-6" />
					</div>
					<p className="text-[15px] font-bold text-foreground/80">
						Nenhuma sessão registrada
					</p>
					<p className="mt-2 text-[12px] text-muted-foreground/50 leading-relaxed font-medium">
						Quando uma nova crônica for iniciada, ela aparecerá aqui como destaque no seu grimório.
					</p>
				</div>
			)}
		</aside>
	);
}
