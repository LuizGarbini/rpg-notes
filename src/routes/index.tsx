import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	MapIcon,
	Package,
	ScrollText,
	User,
	Users,
} from "lucide-react";
export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
			<div className="flex flex-1">
				<div className="w-full">
					<div className="py-6 px-8 border-b border-purple-800/25">
						<h2 className="text-3xl font-bold">Dashboard</h2>
						<span className="mt-1 text-sm text-muted-foreground">
							Bem-vindo ao seu grimório digital
						</span>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Link
								to="/characters"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-blue-400">
												<User className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													Personagens
												</h3>
												<p className="text-sm text-muted-foreground">
													Gerencie seus Personagens
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
							<Link
								to="/npcs"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-purple-400">
												<Users className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													NPCs
												</h3>
												<p className="text-sm text-muted-foreground">
													Organize os NPCs
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
							<Link
								to="/sessions"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-amber-400">
												<ScrollText className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													Sessões
												</h3>
												<p className="text-sm text-muted-foreground">
													Histórico de Sessões
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
							<Link
								to="/items"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-emerald-400">
												<Package className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													Itens & Inventário
												</h3>
												<p className="text-sm text-muted-foreground">
													Tesouros e Equipamentos
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
							<Link
								to="/locations"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-red-400">
												<MapIcon className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													Locais e Mapas
												</h3>
												<p className="text-sm text-muted-foreground">
													Histórico de Sessões
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
							<Link
								to="/lore"
								className="group relative z-10 rounded-xl border border-purple-800/25 p-6 transition-all hover:border-purple-500/20 hover:shadow-lg"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="rounded-lg bg-muted/50 p-2.5 text-indigo-400">
												<BookOpen className="stroke-1.5" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground group-hover:text-primary group-hover:text-purple-500">
													Lore e Notas
												</h3>
												<p className="text-sm text-muted-foreground">
													História e conhecimento
												</p>
											</div>
										</div>
									</div>
									<span className="rounded-full bg-purple-800/20 px-3 py-1 text-sm font-medium text-purple-500">
										3
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
							</Link>
						</div>
					</div>
				</div>
			</div>
	);
}
