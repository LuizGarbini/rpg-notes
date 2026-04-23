import { Filter, Search } from "lucide-react";

interface ListLayoutProps {
	onSearch?: (query: string) => void;
	onAddNew?: () => void;
}

export function ListLayout({ onSearch }: ListLayoutProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="relative flex-1 group">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
				<input
					type="text"
					placeholder="Buscar no grimório…"
					onChange={(e) => onSearch?.(e.target.value)}
					className="h-9 w-full rounded-md border border-border bg-card-elevated/60 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border-hover/60"
				/>
				<kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center rounded border border-border bg-muted/40 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex">
					⌘K
				</kbd>
			</div>

			<button
				type="button"
				className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-card-elevated/60 px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:border-border-hover hover:text-foreground"
			>
				<Filter className="h-3.5 w-3.5" />
				Filtros
			</button>
		</div>
	);
}
