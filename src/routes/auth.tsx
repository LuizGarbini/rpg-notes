import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Swords } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
	component: AuthPage,
});

/* ─── Schemas ─── */

const loginSchema = z.object({
	email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
	password: z.string().min(6, "Mínimo de 6 caracteres"),
});

const registerSchema = z
	.object({
		name: z.string().min(2, "Mínimo de 2 caracteres"),
		email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
		password: z.string().min(6, "Mínimo de 6 caracteres"),
		confirmPassword: z.string().min(1, "Confirme sua senha"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

const resetPasswordSchema = z
	.object({
		password: z.string().min(6, "Mínimo de 6 caracteres"),
		confirmPassword: z.string().min(1, "Confirme sua senha"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const AUTH_PARTICLES = [0, 1, 2, 3, 4];

/* ─── Page ─── */

type AuthMode = "login" | "register" | "forgot" | "reset";

function AuthPage() {
	const search = new URLSearchParams(window.location.search);
	const initialMode = (search.get("mode") as AuthMode) || "login";
	const [mode, setMode] = useState<AuthMode>(initialMode);
	const { session, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && session && mode !== "reset") {
			void navigate({ to: "/dashboard", replace: true });
		}
	}, [loading, navigate, session, mode]);

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
			{/* Background effects */}
			<div className="pointer-events-none fixed inset-0 -z-20 arcane-grid opacity-[0.05]" />
			<div
				className="pointer-events-none fixed inset-0 -z-10"
				style={{
					background: `
						radial-gradient(ellipse 800px 500px at 30% 30%, oklch(0.66 0.20 290 / 0.10), transparent 60%),
						radial-gradient(ellipse 600px 400px at 70% 70%, oklch(0.55 0.20 320 / 0.07), transparent 60%)
					`,
				}}
			/>

			{/* Floating particles */}
			<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				{AUTH_PARTICLES.map((i) => (
					<div
						key={`auth-particle-${i}`}
						className="absolute h-1 w-1 rounded-full bg-primary/30"
						style={{
							left: `${10 + i * 20}%`,
							top: `${15 + (i % 3) * 30}%`,
							animation: `glow-pulse ${3 + i * 0.7}s ease-in-out infinite`,
							animationDelay: `${i * 0.5}s`,
						}}
					/>
				))}
			</div>

			{/* Back to landing */}
			<Link
				to="/"
				className="fixed left-5 top-5 z-50 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				Voltar
			</Link>

			{/* Card */}
			<div className="w-full max-w-md">
				{/* Brand */}
				<div className="mb-8 flex flex-col items-center gap-3">
					<div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
						<Swords className="h-5 w-5 text-primary" strokeWidth={1.6} />
					</div>
					<div className="text-center leading-none">
						<span className="font-display text-base font-bold tracking-[0.18em] text-foreground">
							RPG NOTES
						</span>
						<p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
							Grimoire
						</p>
					</div>
				</div>

				<div className="panel corner-mark p-6 sm:p-8">
					{/* Tabs */}
					{mode !== "forgot" && mode !== "reset" ? (
						<div className="mb-6 flex rounded-md border border-border bg-muted/50 p-0.5">
							<button
								type="button"
								onClick={() => setMode("login")}
								className={`flex-1 rounded-[5px] py-2 text-[13px] font-medium transition-all ${
									mode === "login"
										? "bg-card text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Entrar
							</button>
							<button
								type="button"
								onClick={() => setMode("register")}
								className={`flex-1 rounded-[5px] py-2 text-[13px] font-medium transition-all ${
									mode === "register"
										? "bg-card text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								Criar Conta
							</button>
						</div>
					) : (
						<div className="mb-6">
							<button
								type="button"
								onClick={() => setMode("login")}
								className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="h-3 w-3" />
								Voltar para o login
							</button>
						</div>
					)}

					{mode === "login" && <LoginForm onForgot={() => setMode("forgot")} />}
					{mode === "register" && <RegisterForm />}
					{mode === "forgot" && <ForgotPasswordForm />}
					{mode === "reset" && <ResetPasswordForm />}
				</div>
			</div>
		</div>
	);
}

/* ─── Login Form ─── */

/* ─── Login Form ─── */

function LoginForm({ onForgot }: { onForgot: () => void }) {
	const navigate = useNavigate();
	const { signIn } = useAuth();
	const [showPw, setShowPw] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const emailId = useId();
	const passwordId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
	});

	async function onSubmit(data: LoginValues) {
		setAuthError(null);
		const error = await signIn(data.email, data.password);
		if (error) {
			setAuthError(error);
			return;
		}
		navigate({ to: "/dashboard" });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="text-center mb-5">
				<h2 className="font-display text-lg font-bold text-foreground">
					Bem-vindo de volta
				</h2>
				<p className="mt-1 text-[12px] text-muted-foreground">
					Entre no seu grimório
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={emailId}>Email</Label>
				<Input
					id={emailId}
					type="email"
					placeholder="seu@email.com"
					{...register("email")}
					aria-invalid={!!errors.email}
				/>
				{errors.email && (
					<p className="text-[12px] text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={passwordId}>Senha</Label>
				<div className="relative">
					<Input
						id={passwordId}
						type={showPw ? "text" : "password"}
						placeholder="••••••••"
						{...register("password")}
						aria-invalid={!!errors.password}
					/>
					<button
						type="button"
						onClick={() => setShowPw(!showPw)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showPw ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-[12px] text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>
			{authError && <p className="text-[12px] text-destructive">{authError}</p>}

			<div className="flex justify-end">
				<button
					type="button"
					onClick={onForgot}
					className="text-[12px] text-primary hover:underline underline-offset-4"
				>
					Esqueceu a senha?
				</button>
			</div>

			<Button
				type="submit"
				className="w-full"
				size="lg"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Entrando..." : "Entrar"}
			</Button>
		</form>
	);
}

/* ─── Register Form ─── */

function RegisterForm() {
	const navigate = useNavigate();
	const { signUp } = useAuth();
	const [showPw, setShowPw] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
	});

	async function onSubmit(data: RegisterValues) {
		setAuthError(null);
		const error = await signUp(data.name, data.email, data.password);
		if (error) {
			setAuthError(error);
			return;
		}
		navigate({ to: "/dashboard" });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="text-center mb-5">
				<h2 className="font-display text-lg font-bold text-foreground">
					Crie seu grimório
				</h2>
				<p className="mt-1 text-[12px] text-muted-foreground">
					Registre-se e organize suas campanhas
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={nameId}>Nome</Label>
				<Input
					id={nameId}
					placeholder="Seu nome de aventureiro"
					{...register("name")}
					aria-invalid={!!errors.name}
				/>
				{errors.name && (
					<p className="text-[12px] text-destructive">{errors.name.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={emailId}>Email</Label>
				<Input
					id={emailId}
					type="email"
					placeholder="seu@email.com"
					{...register("email")}
					aria-invalid={!!errors.email}
				/>
				{errors.email && (
					<p className="text-[12px] text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={passwordId}>Senha</Label>
				<div className="relative">
					<Input
						id={passwordId}
						type={showPw ? "text" : "password"}
						placeholder="Mínimo 6 caracteres"
						{...register("password")}
						aria-invalid={!!errors.password}
					/>
					<button
						type="button"
						onClick={() => setShowPw(!showPw)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showPw ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-[12px] text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={confirmPasswordId}>Confirmar Senha</Label>
				<div className="relative">
					<Input
						id={confirmPasswordId}
						type={showConfirm ? "text" : "password"}
						placeholder="Repita a senha"
						{...register("confirmPassword")}
						aria-invalid={!!errors.confirmPassword}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm(!showConfirm)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showConfirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.confirmPassword && (
					<p className="text-[12px] text-destructive">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>
			{authError && <p className="text-[12px] text-destructive">{authError}</p>}

			<Button
				type="submit"
				className="w-full"
				size="lg"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Criando conta..." : "Criar Conta"}
			</Button>

			<p className="text-center text-[11px] text-muted-foreground">
				Ao criar uma conta, você concorda com nossos{" "}
				<button
					type="button"
					className="text-primary hover:underline underline-offset-4"
				>
					Termos
				</button>{" "}
				e{" "}
				<button
					type="button"
					className="text-primary hover:underline underline-offset-4"
				>
					Privacidade
				</button>
			</p>
		</form>
	);
}

/* ─── Forgot Password Form ─── */

function ForgotPasswordForm() {
	const { resetPassword } = useAuth();
	const [authError, setAuthError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const emailId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	async function onSubmit(data: ForgotPasswordValues) {
		setAuthError(null);
		const error = await resetPassword(data.email);
		if (error) {
			setAuthError(error);
			return;
		}
		setSuccess(true);
	}

	if (success) {
		return (
			<div className="text-center space-y-4">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
					<CheckCircle2 className="h-6 w-6 text-emerald-400" />
				</div>
				<div>
					<h2 className="font-display text-lg font-bold text-foreground">
						Ritual de Recuperação Iniciado
					</h2>
					<p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
						Enviamos um link mágico para o seu e-mail. Verifique sua caixa de
						entrada para redefinir sua senha.
					</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="text-center mb-5">
				<h2 className="font-display text-lg font-bold text-foreground">
					Recuperar Acesso
				</h2>
				<p className="mt-1 text-[12px] text-muted-foreground">
					Informe seu email para receber o link de redefinição
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={emailId}>Email</Label>
				<Input
					id={emailId}
					type="email"
					placeholder="seu@email.com"
					{...register("email")}
					aria-invalid={!!errors.email}
				/>
				{errors.email && (
					<p className="text-[12px] text-destructive">{errors.email.message}</p>
				)}
			</div>

			{authError && <p className="text-[12px] text-destructive">{authError}</p>}

			<Button
				type="submit"
				className="w-full"
				size="lg"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Enviando..." : "Enviar Link"}
			</Button>
		</form>
	);
}

/* ─── Reset Password Form ─── */

function ResetPasswordForm() {
	const { updatePassword } = useAuth();
	const [showPw, setShowPw] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const passwordId = useId();
	const confirmPasswordId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordValues) => {
		setAuthError(null);
		const errorMsg = await updatePassword(data.password);

		if (errorMsg) {
			setAuthError(errorMsg);
			return;
		}
		setSuccess(true);
	};

	if (success) {
		return (
			<div className="text-center space-y-4">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
					<CheckCircle2 className="h-6 w-6 text-emerald-400" />
				</div>
				<div>
					<h2 className="font-display text-lg font-bold text-foreground">
						Senha Reforjada
					</h2>
					<p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
						Sua nova senha foi gravada no grimório com sucesso. Agora você já
						pode entrar novamente.
					</p>
				</div>
				<Button
					className="w-full"
					onClick={() => (window.location.href = "/auth")}
				>
					Ir para o Login
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="text-center mb-5">
				<h2 className="font-display text-lg font-bold text-foreground">
					Nova Senha Arcaica
				</h2>
				<p className="mt-1 text-[12px] text-muted-foreground">
					Escolha uma nova combinação para proteger seu grimório
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={passwordId}>Nova Senha</Label>
				<div className="relative">
					<Input
						id={passwordId}
						type={showPw ? "text" : "password"}
						placeholder="••••••••"
						{...register("password")}
						aria-invalid={!!errors.password}
					/>
					<button
						type="button"
						onClick={() => setShowPw(!showPw)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showPw ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-[12px] text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={confirmPasswordId}>Confirmar Nova Senha</Label>
				<div className="relative">
					<Input
						id={confirmPasswordId}
						type={showConfirm ? "text" : "password"}
						placeholder="Repita a nova senha"
						{...register("confirmPassword")}
						aria-invalid={!!errors.confirmPassword}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm(!showConfirm)}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showConfirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{errors.confirmPassword && (
					<p className="text-[12px] text-destructive">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			{authError && <p className="text-[12px] text-destructive">{authError}</p>}

			<Button
				type="submit"
				className="w-full"
				size="lg"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Atualizando..." : "Atualizar Senha"}
			</Button>
		</form>
	);
}
