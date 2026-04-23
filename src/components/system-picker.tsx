import { ArrowRight } from "lucide-react";
import type { RpgSystem } from "@/lib/store";
import { SYSTEM_LIST } from "@/lib/systems";

interface SystemPickerProps {
	value?: RpgSystem;
	onSelect: (system: RpgSystem) => void;
}

/**
 * Etapa inicial da criação de personagem: o usuário escolhe o sistema
 * para que o formulário renderize os campos corretos.
 *
 * Os mesmos templates são úteis depois para "duplicar" um personagem
 * trocando de sistema, importar fichas externas etc.
 */
export function SystemPicker({ value, onSelect }: SystemPickerProps) {
	return (
		<div className="space-y-3">
			<div>
				<h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground heading-rule">
					Escolha o sistema
				</h3>
				<p className="mt-2 text-[12px] text-muted-foreground">
					O formulário se adapta ao sistema escolhido — atributos, perícias e
					seções específicas mudam conforme a escolha.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{SYSTEM_LIST.map((s) => {
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
								className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-linear-to-br ${s.bgAccent} ring-1 ring-border ${s.accent}`}
							>
								<Icon className="h-4 w-4" strokeWidth={1.6} />
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<h4 className="font-display text-[13px] font-bold text-foreground">
										{s.label}
									</h4>
									<ArrowRight
										className={`h-3.5 w-3.5 shrink-0 transition-all ${
											active
												? "text-primary translate-x-0.5"
												: "text-muted-foreground/50 group-hover:translate-x-0.5 group-hover:text-foreground"
										}`}
									/>
								</div>
								<p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
									{s.tagline}
								</p>
								<p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
									{s.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
