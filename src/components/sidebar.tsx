import { Link } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronDown,
	FileText,
	HelpCircle,
	House,
	Map as MapIcon,
	MessageSquareText,
	Package,
	ScrollText,
	User,
	Users,
} from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

const grimoireItems = [
	{ to: "/dashboard", label: "Dashboard", Icon: House },
	{ to: "/characters", label: "Personagens", Icon: User },
	{ to: "/sheets", label: "Fichas", Icon: FileText },
	{ to: "/npcs", label: "NPCs", Icon: Users },
	{ to: "/sessions", label: "Sessões", Icon: ScrollText },
];

const worldItems = [
	{ to: "/items", label: "Itens", Icon: Package },
	{ to: "/locations", label: "Locais", Icon: MapIcon },
	{ to: "/lore", label: "Lore", Icon: BookOpen },
];

interface SidebarProps {
	isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
	const isCollapsed = !isOpen;

	return (
		<aside
			className={`relative flex h-full shrink-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-sidebar/40 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 ease-in-out ${
				isOpen ? "w-[240px]" : "w-[64px]"
			}`}
		>
			<div className="flex h-full flex-col">
				{/* Brand & Switcher */}
				<div className={`px-3 py-4 transition-all ${isCollapsed ? "items-center" : ""}`}>
					<div className={`mb-6 flex items-center gap-2 px-1 ${isCollapsed ? "justify-center" : ""}`}>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/20 ring-1 ring-primary/40">
							<svg
								viewBox="0 0 24 24"
								className="h-5 w-5 text-primary"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
							>
								<path d="M4 6h11a4 4 0 0 1 0 8H6a3 3 0 0 0 0 6h12" />
							</svg>
						</div>
						{!isCollapsed && (
							<span className="font-display text-[13px] font-bold tracking-[0.2em] text-foreground transition-all">
								RPG NOTES
							</span>
						)}
					</div>

					<button className={`flex w-full items-center gap-2 rounded-lg border border-border/50 bg-background/50 transition-all hover:bg-muted/80 ${
						isCollapsed ? "justify-center p-1.5" : "p-2"
					}`}>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-linear-to-br from-primary to-fuchsia-600 text-[10px] font-bold text-primary-foreground shadow-sm">
							WC
						</div>
						{!isCollapsed && (
							<>
								<div className="flex min-w-0 flex-1 flex-col leading-tight">
									<span className="truncate text-[12px] font-bold text-foreground">
										Worldcraft
									</span>
									<span className="truncate text-[10px] text-muted-foreground">
										Campanha Principal
									</span>
								</div>
								<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
							</>
						)}
					</button>
				</div>

				{/* Nav Sections */}
				<div className="flex-1 space-y-6 overflow-y-auto px-3 py-2 scrollbar-none">
					<SidebarNav title="Grimório" isCollapsed={isCollapsed} items={grimoireItems} />
					<SidebarNav title="Mundo" isCollapsed={isCollapsed} items={worldItems} />
				</div>

				{/* Footer / Pro Card */}
				<div className="mt-auto space-y-4 p-3">
					{!isCollapsed ? (
						<div className="rounded-xl border border-primary/20 bg-primary/5 p-3 ring-1 ring-primary/10">
							<div className="flex items-center gap-2 text-[11px] font-bold text-primary">
								<div className="h-1.5 w-1.5 rounded-full bg-primary" />
								Plano Pro
							</div>
							<p className="mt-1 text-[11px] font-medium leading-normal text-foreground/90">
								Libere recursos exclusivos e limite ilimitado de fichas.
							</p>
							<button className="mt-2.5 w-full rounded-md bg-primary px-2 py-1.5 text-[11px] font-bold text-primary-foreground transition-opacity hover:opacity-90">
								Adquirir Plano Pro
							</button>
						</div>
					) : (
						<div className="flex justify-center">
							<div className="h-2 w-2 rounded-full bg-primary animate-pulse" title="Assinar Pro" />
						</div>
					)}

					<div className="space-y-0.5 border-t border-border/60 pt-3">
						<Link
							to="/dashboard"
							title="Central de Ajuda"
							className={`flex items-center gap-2 rounded-md text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground ${
								isCollapsed ? "justify-center p-2" : "px-3 py-1.5"
							}`}
						>
							<HelpCircle className="h-4 w-4" />
							{!isCollapsed && <span>Central de Ajuda</span>}
						</Link>
						<Link
							to="/dashboard"
							title="Feedback"
							className={`flex items-center gap-2 rounded-md text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground ${
								isCollapsed ? "justify-center p-2" : "px-3 py-1.5"
							}`}
						>
							<MessageSquareText className="h-4 w-4" />
							{!isCollapsed && <span>Feedback</span>}
						</Link>
					</div>
				</div>
			</div>
		</aside>
	);
}
