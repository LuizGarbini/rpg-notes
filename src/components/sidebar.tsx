import { Link } from "@tanstack/react-router";
import {
	BookOpen,
	FileText,
	House,
	Map as MapIcon,
	Package,
	ScrollText,
	User,
	Users,
} from "lucide-react";

const navItems = [
	{ to: "/dashboard", label: "Dashboard", Icon: House },
	{ to: "/characters", label: "Personagens", Icon: User },
	{ to: "/sheets", label: "Fichas", Icon: FileText },
	{ to: "/npcs", label: "NPCs", Icon: Users },
	{ to: "/sessions", label: "Sessões", Icon: ScrollText },
	{ to: "/items", label: "Itens", Icon: Package },
	{ to: "/locations", label: "Locais", Icon: MapIcon },
	{ to: "/lore", label: "Lore", Icon: BookOpen },
];

export function Sidebar() {
	return (
		<aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/90 backdrop-blur-md">
			<div className="flex h-full flex-col">
				{/* Brand */}
				<div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
					<div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="h-4 w-4 text-primary"
							strokeWidth="1.6"
							stroke="currentColor"
							aria-hidden
						>
							<title>Logo</title>
							<path d="M4 6h11a4 4 0 0 1 0 8H6a3 3 0 0 0 0 6h12" />
							<path d="M9 6V4M9 20v-2" strokeLinecap="round" />
						</svg>
					</div>
					<div className="flex min-w-0 flex-col leading-none">
						<span className="font-display text-[13px] font-bold tracking-[0.18em] text-foreground">
							RPG NOTES
						</span>
						<span className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
							Grimoire
						</span>
					</div>
				</div>

				{/* Nav */}
				<nav className="flex-1 px-2 py-3">
					<div className="mb-1 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
						Geral
					</div>
					<div className="space-y-0.5">
						{navItems.map(({ to, label, Icon }) => (
							<Link
								key={to}
								to={to}
								activeOptions={{ exact: to === "/dashboard" }}
								activeProps={{
									className: "bg-primary/10 text-primary",
								}}
								inactiveProps={{
									className:
										"text-muted-foreground hover:bg-muted/60 hover:text-foreground",
								}}
								className="group/nav relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
							>
								{({ isActive }) => (
									<>
										{isActive && (
											<span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-primary" />
										)}
										<Icon
											className="h-3.5 w-3.5 shrink-0"
											strokeWidth={isActive ? 2 : 1.6}
										/>
										<span>{label}</span>
									</>
								)}
							</Link>
						))}
					</div>
				</nav>

				{/* User */}
				<div className="border-t border-sidebar-border px-3 py-3">
					<div className="flex items-center gap-2.5">
						<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary ring-1 ring-primary/25">
							LG
						</div>
						<div className="flex min-w-0 flex-col leading-tight">
							<span className="truncate text-[12px] font-semibold text-foreground">
								Luiz Garbini
							</span>
							<span className="truncate text-[10px] text-muted-foreground">
								Mestre da Campanha
							</span>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
