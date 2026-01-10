import { Filter, Search } from "lucide-react";

interface ListLayoutProps {
	onSearch?: (query: string) => void;
	onAddNew?: () => void;
}

export function ListLayout({ onSearch, onAddNew }: ListLayoutProps) {
	return (
		<div className="relative parchment-bg">
			<div className="mt-6 flex gap-3">
				<div className="relative flex-1 group">
					<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
					<input
						type="text"
						placeholder="Buscar..."
						onChange={(e) => onSearch?.(e.target.value)}
						className="w-full rounded-xl border border-border bg-background/30 py-2.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background/50 hover:border-border-hover hover:bg-background/40"
					/>
				</div>
				<button
					type="button"
					className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary-dark text-primary text-sm font-medium transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
				>
					<Filter className="h-4 w-4" />
					Filtros
				</button>
			</div>
		</div>
	);
}
