import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	MapIcon,
	Package,
	ScrollText,
	Shield,
	Sparkles,
	Swords,
	User,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

/* ─── Features ─── */

const features = [
	{
		Icon: User,
		title: "Personagens",
		desc: "Fichas completas e detalhadas",
		color: "text-violet-400",
	},
	{
		Icon: ScrollText,
		title: "Sessões",
		desc: "Crônicas da sua aventura",
		color: "text-amber-400",
	},
	{
		Icon: Users,
		title: "NPCs",
		desc: "Aliados, vilões e mistérios",
		color: "text-fuchsia-400",
	},
	{
		Icon: MapIcon,
		title: "Locais",
		desc: "Mapeie reinos e fronteiras",
		color: "text-rose-400",
	},
	{
		Icon: Package,
		title: "Itens",
		desc: "Tesouros e relíquias arcanas",
		color: "text-emerald-400",
	},
	{
		Icon: BookOpen,
		title: "Lore",
		desc: "Todo o saber do mundo",
		color: "text-indigo-400",
	},
];

/* ─── Page ─── */

function LandingPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background effects */}
			<div className="pointer-events-none fixed inset-0 -z-20 arcane-grid opacity-[0.05]" />
			<div
				className="pointer-events-none fixed inset-0 -z-10"
				style={{
					background: `
						radial-gradient(ellipse 800px 500px at 20% 20%, oklch(0.66 0.20 290 / 0.08), transparent 60%),
						radial-gradient(ellipse 600px 400px at 80% 80%, oklch(0.55 0.20 320 / 0.06), transparent 60%),
						radial-gradient(ellipse 400px 300px at 50% 50%, oklch(0.60 0.18 285 / 0.04), transparent 70%)
					`,
				}}
			/>

			{/* Floating particles */}
			<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="absolute h-1 w-1 rounded-full bg-primary/30"
						style={{
							left: `${15 + i * 15}%`,
							top: `${20 + (i % 3) * 25}%`,
							animation: `glow-pulse ${3 + i * 0.7}s ease-in-out infinite`,
							animationDelay: `${i * 0.5}s`,
						}}
					/>
				))}
			</div>

			{/* Navbar */}
			<header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
				<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
					<div className="flex items-center gap-2.5">
						<div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
							<Swords className="h-4 w-4 text-primary" strokeWidth={1.6} />
						</div>
						<div className="flex flex-col leading-none">
							<span className="font-display text-[13px] font-bold tracking-[0.18em] text-foreground">
								RPG NOTES
							</span>
							<span className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
								Grimoire
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link to="/auth">
							<Button variant="ghost" size="sm">
								Entrar
							</Button>
						</Link>
						<Link to="/auth">
							<Button size="sm">
								<Sparkles className="h-3.5 w-3.5" />
								Criar Conta
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center lg:pt-28 lg:pb-20">
				<div className="relative inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-6">
					<Shield className="h-3 w-3" />
					Seu grimório digital de RPG
				</div>
				<h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
					<span className="text-gradient-primary">Organize</span>{" "}
					<span className="text-foreground">suas</span>
					<br />
					<span className="text-foreground">campanhas de RPG</span>
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
					Registre personagens, sessões, lore, itens e tudo que faz parte da sua
					aventura — tudo em um só lugar, bonito e organizado.
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<Link to="/auth">
						<Button size="lg" className="gap-2 px-6">
							<Sparkles className="h-4 w-4" />
							Começar Agora
						</Button>
					</Link>
					<Button
						variant="outline"
						size="lg"
						className="px-6"
						onClick={() =>
							document
								.getElementById("features")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						Explorar
					</Button>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="mx-auto max-w-5xl px-6 py-16">
				<div className="text-center mb-10">
					<h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground heading-rule mx-auto w-fit">
						Funcionalidades
					</h2>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
					{features.map((f) => (
						<div
							key={f.title}
							className="group rounded-lg border border-border bg-card-elevated p-4 text-center transition-all hover:border-border-hover hover:-translate-y-0.5"
						>
							<div
								className={`mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-md bg-background/60 ring-1 ring-border ${f.color}`}
							>
								<f.Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
							</div>
							<h3 className="text-[13px] font-semibold text-foreground">
								{f.title}
							</h3>
							<p className="mt-0.5 text-[11px] text-muted-foreground">
								{f.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-2xl px-6 py-16 text-center">
				<div className="panel corner-mark p-8 sm:p-12">
					<h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
						Pronto para a{" "}
						<span className="text-gradient-primary">aventura</span>?
					</h2>
					<p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
						Crie sua conta gratuitamente e comece a documentar sua campanha
						agora mesmo.
					</p>
					<div className="mt-6">
						<Link to="/auth">
							<Button size="lg" className="gap-2 px-8">
								<Sparkles className="h-4 w-4" />
								Criar Conta Grátis
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border/50 py-8 text-center text-[11px] text-muted-foreground">
				<span className="font-display tracking-wider">RPG NOTES</span> — Seu
				grimório digital
			</footer>
		</div>
	);
}
