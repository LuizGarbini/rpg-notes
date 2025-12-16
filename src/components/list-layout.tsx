import { Button } from "@base-ui-components/react";
import { Filter, Plus, Search } from "lucide-react";

interface ListLayoutProps {
	onSearch?: (query: string) => void;
	onAddNew?: () => void;
}

export function ListLayout({ onSearch, onAddNew }: ListLayoutProps) {
	return (
		<div className="relative parchment-bg min-h-screen">
			<div className="mt-6 flex gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Buscar..."
						onChange={(e) => onSearch?.(e.target.value)}
						className="w-full rounded-lg border border-border bg-background/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
				<Button className="border-border bg-transparent">
					<Filter className="mr-2 h-4 w-4" />
					Filtros
				</Button>
			</div>
		</div>
	);
}
