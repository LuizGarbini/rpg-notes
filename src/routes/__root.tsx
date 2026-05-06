import {
	createRootRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { AppHeader } from "@/components/app-header";
import { GlobalError } from "@/components/global-error";
import { NotFound } from "@/components/not-found";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useRPGStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
	component: RootLayout,
	errorComponent: GlobalError,
	notFoundComponent: NotFound,
});

function RootLayout() {
	return (
		<ToastProvider>
			<AuthProvider>
				<RootContent />
			</AuthProvider>
		</ToastProvider>
	);
}

function RootContent() {
	const location = useLocation();
	const isLanding = location.pathname === "/";
	const isAuth = location.pathname === "/auth";
	const isErrorPreview = location.pathname === "/error-preview";

	if (isLanding || isAuth || isErrorPreview) {
		return <Outlet />;
	}

	return <ProtectedLayout />;
}

function ProtectedLayout() {
	const navigate = useNavigate();
	const { loading, session } = useAuth();
	const loadRemoteData = useRPGStore((s) => s.loadRemoteData);
	const setupRealtime = useRPGStore((s) => s.setupRealtime);
	const clearLocalData = useRPGStore((s) => s.clearLocalData);
	const syncError = useRPGStore((s) => s.syncError);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		if (loading) return;
		if (!session) {
			clearLocalData();
			void navigate({ to: "/auth", replace: true });
			return;
		}
		void loadRemoteData();
		const cleanup = setupRealtime();

		return () => {
			cleanup();
		};
	}, [
		clearLocalData,
		loadRemoteData,
		loading,
		navigate,
		session,
		setupRealtime,
	]);

	if (loading || (!session && !loading)) {
		return (
			<div className="flex min-h-screen items-center justify-center text-[13px] text-muted-foreground">
				Carregando sess├úo...
			</div>
		);
	}

	return (
		<div className="relative flex h-screen overflow-hidden bg-background sm:gap-4 sm:p-4">
			<div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_900px_560px_at_12%_0%,var(--primary-muted),transparent_62%),radial-gradient(ellipse_700px_520px_at_100%_100%,oklch(0.55_0.2_320/0.08),transparent_64%),linear-gradient(180deg,var(--background),var(--muted))]" />
			<div className="pointer-events-none fixed inset-0 -z-10 arcane-grid opacity-[0.035]" />

			{/* Mobile Sidebar Overlay */}
			{isSidebarOpen && (
				<button
					type="button"
					aria-label="Fechar menu lateral"
					className="fixed inset-0 z-90 bg-background/60 backdrop-blur-sm md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Sidebar Island */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-100 flex flex-col overflow-hidden transition-all duration-300 bg-background md:relative md:z-0 md:flex md:translate-x-0 md:rounded-2xl md:border md:border-border/60 md:bg-card/70 md:shadow-2xl md:shadow-black/10 md:backdrop-blur-xl",
					isSidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<Sidebar
					isOpen={true}
					onItemClick={() => {
						if (window.innerWidth < 768) {
							setIsSidebarOpen(false);
						}
					}}
				/>
			</div>

			{/* Dashboard Island */}
			<div className="flex flex-1 flex-col overflow-hidden bg-card/70 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-2xl sm:border sm:border-border/60">
				<AppHeader
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden bg-linear-to-b from-background/25 via-transparent to-muted/20 scrollbar-none">
					{syncError && (
						<div className="mx-4 mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-[12px] font-medium text-destructive sm:mx-6">
							Falha ao sincronizar: {syncError}
						</div>
					)}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
