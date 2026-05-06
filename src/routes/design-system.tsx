import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Bell,
	BookOpen,
	CheckCircle2,
	ChevronRight,
	Info,
	MousePointer2,
	PanelLeft,
	Plus,
	Sparkles,
	WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export const Route = createFileRoute("/design-system")({
	component: DesignSystem,
});

const swatches = [
	{ name: "Background", className: "bg-background", text: "text-foreground" },
	{ name: "Card", className: "bg-card", text: "text-card-foreground" },
	{ name: "Muted", className: "bg-muted", text: "text-muted-foreground" },
	{ name: "Primary", className: "bg-primary", text: "text-primary-foreground" },
	{
		name: "Destructive",
		className: "bg-destructive",
		text: "text-primary-foreground",
	},
];

function DesignSystem() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
			<header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card-elevated p-6 shadow-lg shadow-black/5 sm:p-8">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_520px_240px_at_20%_0%,var(--primary-muted),transparent_70%)]" />
				<div className="relative max-w-3xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
						<WandSparkles className="h-3.5 w-3.5" />
						Design System
					</div>
					<h1 className="font-display mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						RPG Notes UI
					</h1>
					<p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
						Referência visual para manter o produto com cara de grimório
						digital: editorial, arcano, discreto e consistente.
					</p>
				</div>
			</header>

			<section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
				<SpecPanel eyebrow="Tipografia" title="Hierarquia">
					<div className="space-y-5">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
								Display
							</p>
							<p className="font-display mt-1 text-4xl font-bold text-gradient-primary">
								Crônicas do Reino
							</p>
						</div>
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
								Título
							</p>
							<p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
								Dashboard da campanha
							</p>
						</div>
						<p className="text-[14px] leading-relaxed text-muted-foreground">
							Textos longos usam Inter com contraste suave. Rótulos ficam em
							caixa alta, pequenos e espaçados para reforçar a estética
							editorial.
						</p>
					</div>
				</SpecPanel>

				<SpecPanel eyebrow="Tokens" title="Cores e superfícies">
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
						{swatches.map((swatch) => (
							<div
								key={swatch.name}
								className={`${swatch.className} ${swatch.text} flex min-h-24 flex-col justify-end rounded-xl border border-border/70 p-3 shadow-sm`}
							>
								<span className="text-[11px] font-bold">{swatch.name}</span>
							</div>
						))}
					</div>
					<div className="mt-4 grid gap-3 sm:grid-cols-3">
						<SurfaceSample title="Base" />
						<SurfaceSample title="Elevada" elevated />
						<SurfaceSample title="Interativa" interactive />
					</div>
				</SpecPanel>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<SpecPanel eyebrow="Componentes" title="Botões">
					<div className="flex flex-wrap gap-3">
						<Button className="h-11 gap-2 px-5">
							<Plus className="h-4 w-4" />
							Primário
						</Button>
						<Button variant="outline" className="h-11 gap-2 px-5">
							<ChevronRight className="h-4 w-4" />
							Secundário
						</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive" className="gap-2">
							<AlertTriangle className="h-4 w-4" />
							Perigo
						</Button>
						<Button disabled>Desabilitado</Button>
					</div>
					<p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
						Botões usam feedback imediato com `active: scale(0.97)`, duração
						curta e easing `cubic-bezier(0.16, 1, 0.3, 1)`.
					</p>
				</SpecPanel>

				<SpecPanel eyebrow="Navegação" title="Sidebar e Header">
					<div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
						<div className="rounded-2xl border border-border/70 bg-card-elevated p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
									<img
										src="/favicon.svg"
										alt="RPG Notes"
										className="h-6 w-6"
										draggable={false}
									/>
								</div>
								<div>
									<p className="font-display text-[13px] font-bold tracking-[0.2em]">
										RPG NOTES
									</p>
									<p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
										Grimório
									</p>
								</div>
							</div>
							<div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-[12px] font-bold text-primary">
								Dashboard
							</div>
							<div className="mt-3 rounded-2xl border border-primary/20 bg-primary/8 p-3">
								<div className="flex items-center justify-between gap-2">
									<span className="text-[11px] font-bold text-primary">
										Plano Free
									</span>
									<span className="rounded-full border border-border/60 bg-background/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
										Free
									</span>
								</div>
								<p className="mt-2 text-[11px] text-muted-foreground">
									8 de 20 criações usadas
								</p>
								<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/70 ring-1 ring-border/60">
									<div className="h-full w-2/5 rounded-full bg-linear-to-r from-primary to-fuchsia-500" />
								</div>
								<Button
									variant="outline"
									className="mt-3 h-8 w-full text-[11px]"
								>
									Upgrade
								</Button>
							</div>
						</div>
						<div className="rounded-2xl border border-border/70 bg-card-elevated p-4">
							<div className="flex items-center gap-3">
								<Button variant="ghost" size="icon" className="rounded-xl">
									<PanelLeft className="h-4 w-4" />
								</Button>
								<div className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-background/55 px-4 py-2 text-[13px] text-muted-foreground">
									Pesquisar no Grimório...
								</div>
								<Button variant="ghost" size="icon" className="rounded-xl">
									<Bell className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</SpecPanel>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<SpecPanel eyebrow="Formulários" title="Campos">
					<div className="grid gap-3 sm:grid-cols-2">
						<Input
							placeholder="Nome da campanha"
							aria-label="Nome da campanha"
						/>
						<Select aria-label="Sistema">
							<option>D&D 5ª Edição</option>
							<option>Tormenta 20</option>
							<option>Ordem Paranormal</option>
						</Select>
					</div>
					<p className="mt-3 text-[12px] text-muted-foreground">
						Campos mantêm borda discreta, fundo elevado e foco com anel
						primário.
					</p>
				</SpecPanel>

				<SpecPanel eyebrow="Motion" title="Interatividade">
					<div className="grid gap-3 sm:grid-cols-3">
						<MotionRule
							icon={<MousePointer2 className="h-4 w-4 text-primary" />}
							title="Press"
							description="Ações reduzem para 0.97 no toque."
						/>
						<MotionRule
							icon={<Sparkles className="h-4 w-4 text-primary" />}
							title="Entrada"
							description="Menus partem de scale 0.95+, nunca de zero."
						/>
						<MotionRule
							icon={<ChevronRight className="h-4 w-4 text-primary" />}
							title="Easing"
							description="Curvas ease-out rápidas, abaixo de 300ms."
						/>
					</div>
				</SpecPanel>
			</section>

			<SpecPanel eyebrow="Estados" title="Feedback do sistema">
				<div className="grid gap-3 md:grid-cols-3">
					<StateCard
						icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
						title="Sucesso"
						description="Alterações salvas no grimório."
					/>
					<StateCard
						icon={<Info className="h-4 w-4 text-primary" />}
						title="Informação"
						description="Seu progresso foi salvo em segundo plano."
					/>
					<StateCard
						icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
						title="Atenção"
						description="Algo impediu a sincronização."
					/>
				</div>
			</SpecPanel>

			<SpecPanel eyebrow="Card padrão" title="Coleções">
				<div className="grid gap-3 md:grid-cols-3">
					{["Personagens", "Sessões", "Lore"].map((item, index) => (
						<div
							key={item}
							className="group rounded-xl border border-border/70 bg-card-elevated p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-black/5"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
									<BookOpen className="h-4 w-4" />
								</div>
								<span className="font-display text-2xl font-bold text-foreground">
									{index + 2}
								</span>
							</div>
							<h3 className="mt-4 text-[15px] font-bold text-foreground">
								{item}
							</h3>
							<p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
								Card objetivo, com ação clara e uma métrica visível.
							</p>
						</div>
					))}
				</div>
			</SpecPanel>
		</div>
	);
}

function SpecPanel({
	eyebrow,
	title,
	children,
}: {
	eyebrow: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm shadow-black/5">
			<div className="mb-4">
				<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
					{eyebrow}
				</p>
				<h2 className="mt-1 text-lg font-bold tracking-tight text-foreground">
					{title}
				</h2>
			</div>
			{children}
		</section>
	);
}

function SurfaceSample({
	title,
	elevated,
	interactive,
}: {
	title: string;
	elevated?: boolean;
	interactive?: boolean;
}) {
	return (
		<div
			className={`rounded-xl border p-4 text-[12px] transition-all ${
				interactive
					? "border-primary/30 bg-primary/10 text-primary hover:-translate-y-0.5"
					: elevated
						? "border-border/70 bg-card-elevated text-foreground shadow-md shadow-black/5"
						: "border-border/70 bg-card text-muted-foreground"
			}`}
		>
			<Sparkles className="mb-3 h-4 w-4" />
			<strong>{title}</strong>
		</div>
	);
}

function StateCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border border-border/70 bg-card-elevated p-4">
			<div className="flex items-center gap-2">
				{icon}
				<h3 className="text-[13px] font-bold text-foreground">{title}</h3>
			</div>
			<p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function MotionRule({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border border-border/70 bg-card-elevated p-4">
			<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
				{icon}
			</div>
			<h3 className="mt-3 text-[13px] font-bold text-foreground">{title}</h3>
			<p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
				{description}
			</p>
		</div>
	);
}
