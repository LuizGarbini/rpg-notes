import { createFileRoute } from "@tanstack/react-router";
import { Bell, Eye, Moon, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

const preferences = [
	{
		title: "Animações de interface",
		description: "Mantém microinterações, press feedback e entradas suaves.",
		Icon: Sparkles,
		defaultChecked: true,
	},
	{
		title: "Aparência escura",
		description: "Tema editorial escuro do grimório, otimizado para mesa online.",
		Icon: Moon,
		defaultChecked: true,
	},
	{
		title: "Notificações do grimório",
		description: "Alertas de sincronização, sessões e novidades da campanha.",
		Icon: Bell,
		defaultChecked: true,
	},
];

function SettingsPage() {
	const [checked, setChecked] = useState(
		() => new Set(preferences.filter((item) => item.defaultChecked).map((item) => item.title)),
	);

	function togglePreference(title: string) {
		setChecked((current) => {
			const next = new Set(current);
			if (next.has(title)) {
				next.delete(title);
			} else {
				next.add(title);
			}
			return next;
		});
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 sm:px-8">
			<header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-linear-to-br from-card via-card/95 to-primary-muted/25 p-6 shadow-xl shadow-black/5 sm:p-8">
				<div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative max-w-3xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
						<Settings className="h-3.5 w-3.5" />
						Configurações
					</div>
					<h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Preferências da plataforma
					</h1>
					<p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted-foreground">
						Ajustes visuais e de experiência para manter a aplicação com o seu
						ritmo de jogo.
					</p>
				</div>
			</header>

			<div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
				<section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
								Experiência
							</p>
							<h2 className="font-display mt-1 text-xl font-bold text-foreground">
								Preferências visuais
							</h2>
						</div>
						<Button variant="outline" className="h-9 text-xs">
							Salvar rascunho
						</Button>
					</div>

					<div className="mt-5 grid gap-3">
						{preferences.map(({ title, description, Icon }) => {
							const isChecked = checked.has(title);
							return (
								<button
									key={title}
									type="button"
									onClick={() => togglePreference(title)}
									className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/45 p-4 text-left shadow-sm shadow-black/5 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/8 active:scale-[0.99]"
								>
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
										<Icon className="h-4 w-4" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-[14px] font-bold text-foreground">
											{title}
										</p>
										<p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
											{description}
										</p>
									</div>
									<span
										className={`h-6 w-11 rounded-full border p-0.5 transition-colors ${
											isChecked
												? "border-primary/30 bg-primary/30"
												: "border-border bg-muted/50"
										}`}
									>
										<span
											className={`block h-4.5 w-4.5 rounded-full bg-foreground transition-transform ${
												isChecked ? "translate-x-5" : "translate-x-0"
											}`}
										/>
									</span>
								</button>
							);
						})}
					</div>
				</section>

				<section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5">
					<div className="flex h-full flex-col justify-between gap-5">
						<div>
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
								<ShieldCheck className="h-5 w-5" />
							</div>
							<h2 className="font-display mt-4 text-xl font-bold text-foreground">
								Conta e privacidade
							</h2>
							<p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
								As preferências desta página são locais por enquanto. Ajustes
								sensíveis de conta continuam sendo gerenciados pelo Supabase.
							</p>
						</div>
						<div className="rounded-2xl border border-border/70 bg-background/45 p-4">
							<div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
								<Eye className="h-4 w-4 text-primary" />
								Transparência
							</div>
							<p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
								Nenhuma configuração nova altera dados de campanha ou cria
								serviços externos adicionais.
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
