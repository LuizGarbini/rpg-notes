import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import type { RpgSystem } from "@/lib/store";
import { SYSTEM_LIST } from "@/lib/systems";
import { Input } from "./ui/input";

interface SystemPickerProps {
	value?: RpgSystem;
	onSelect: (system: RpgSystem) => void;
}

/**
 * Seletor de template / sistema de RPG.
 * Agora com busca para facilitar a navegação em 35+ sistemas.
 */
export function SystemPicker({ value, onSelect }: SystemPickerProps) {
	const [search, setSearch] = useState("");

	const filtered = SYSTEM_LIST.filter((s) => {
		const q = search.toLowerCase();
		return (
			s.label.toLowerCase().includes(q) ||
			s.tagline.toLowerCase().includes(q) ||
			s.description.toLowerCase().includes(q)
		);
	});

	return (
		<div className="space-y-3">
			{/* Search */}
			<div className="relative">
				<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar sistema..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-8 h-8 text-[13px]"
					autoFocus
				/>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-[50vh] overflow-y-auto pr-1">
				{filtered.map((s) => {
					const Icon = s.Icon;
					const active = value === s.value;
					return (
						<button
							key={s.value}
							type="button"
							onClick={() => onSelect(s.value)}
							className={`group relative flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
								active
									? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
									: "border-border bg-card-elevated/40 hover:border-border-hover hover:bg-card-elevated/70"
							}`}
						>
							<div
								className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-linear-to-br ${s.bgAccent} ring-1 ring-border ${s.accent}`}
							>
								<Icon className="h-4 w-4" strokeWidth={1.6} />
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<h4 className="font-display text-[12px] font-bold text-foreground leading-tight">
										{s.label}
									</h4>
									<ArrowRight
										className={`h-3 w-3 shrink-0 transition-all ${
											active
												? "text-primary translate-x-0.5"
												: "text-muted-foreground/50 group-hover:translate-x-0.5 group-hover:text-foreground"
										}`}
									/>
								</div>
								<p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
									{s.tagline}
								</p>
								<p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
									{s.description}
								</p>
							</div>
						</button>
					);
				})}
				{filtered.length === 0 && (
					<p className="col-span-full py-8 text-center text-[12px] text-muted-foreground">
						Nenhum sistema encontrado para "{search}"
					</p>
				)}
			</div>
		</div>
	);
}
