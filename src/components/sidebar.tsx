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

export function Sidebar() {
	return (
		<aside className="flex min-h-screen flex-col border-r border-purple-800/25">
			<div className="flex h-full flex-col">
				<div className="flex items-center gap-3 border-b p-6 border-purple-800/25">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
						<Book className="text-purple-500 stroke-1" />
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-2xl">RPG NOTES</span>
						<span className="text-xs text-muted-foreground">
							Digital Grimoire
						</span>
					</div>
				</div>
				<nav className="flex-1 space-y-1 p-4">
					<a
						href="/"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-purple-500 font-normal transition-colors bg-purple-500/20"
					>
						<House className="text-purple-500 stroke-1.5" />
						Dashboard
					</a>
					<Link
						to="/characters"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<User className="stroke-1.5" />
						Personagens
					</Link>
					<Link
						to="/npcs"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<Users className="stroke-1.5" />
						NPCs
					</Link>
					<Link
						to="/sessions"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<ScrollText className="stroke-1.5" />
						Sessões
					</Link>
					<Link
						to="/items"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<Package className="stroke-1.5" />
						Itens
					</Link>
					<Link
						to="/locations"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<MapIcon className="stroke-1.5" />
						Locais
					</Link>
					<Link
						to="/lore"
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground font-normal transition-colors hover:bg-purple-500/20 hover:text-white"
					>
						<BookOpen className="stroke-1.5" />
						Lore
					</Link>
				</nav>
				<div className="flex items-center gap-3 border-t p-6 border-purple-800/25">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
						LG
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-xs">Luiz Garbini</span>
						<span className="text-xs text-purple-500">Mestre da Campanha</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
