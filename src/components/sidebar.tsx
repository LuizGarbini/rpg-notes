import { Link } from "@tanstack/react-router";
import {
	Book,
	BookOpen,
	House,
	Map as MapIcon,
	Package,
	ScrollText,
	User,
	Users,
} from "lucide-react";

const navItems = [
	{ to: "/", label: "Dashboard", Icon: House },
	{ to: "/characters", label: "Personagens", Icon: User },
	{ to: "/npcs", label: "NPCs", Icon: Users },
	{ to: "/sessions", label: "Sessões", Icon: ScrollText },
	{ to: "/items", label: "Itens", Icon: Package },
	{ to: "/locations", label: "Locais", Icon: MapIcon },
	{ to: "/lore", label: "Lore", Icon: BookOpen },
];

export function Sidebar() {
	return (
		<aside className="flex min-h-screen flex-col border-r border-border">
			<div className="flex h-full flex-col">
				<div className="flex items-center gap-3 border-b p-6 border-border">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted">
						<Book className="text-primary stroke-1" />
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-2xl">RPG NOTES</span>
						<span className="text-xs text-muted-foreground">
							Digital Grimoire
						</span>
					</div>
				</div>
				<nav className="flex-1 space-y-1 p-4">
					{navItems.map(({ to, label, Icon }) => (
						<Link
							key={to}
							to={to}
							activeProps={{
								className: "bg-primary-muted text-primary",
							}}
							inactiveProps={{
								className:
									"text-muted-foreground hover:bg-primary-muted hover:text-white",
							}}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors"
						>
							<Icon className="stroke-1.5" />
							{label}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-3 border-t p-6 border-border">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted">
						LG
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-xs">Luiz Garbini</span>
						<span className="text-xs text-primary">Mestre da Campanha</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
