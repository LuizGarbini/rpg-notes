import {
	createRootRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { AppHeader } from "@/components/app-header";
import { NotFound } from "@/components/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useRPGStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: NotFound,
});

function RootLayout() {
	return (
		<AuthProvider>
			<RootContent />
		</AuthProvider>
	);
}

function RootContent() {
	const location = useLocation();
	const isLanding = location.pathname === "/";
	const isAuth = location.pathname === "/auth";

	if (isLanding || isAuth) {
		return <Outlet />;
	}

	return <ProtectedLayout />;
}

function ProtectedLayout() {
	const navigate = useNavigate();
	const { loading, session } = useAuth();
	const loadRemoteData = useRPGStore((s) => s.loadRemoteData);
	const clearLocalData = useRPGStore((s) => s.clearLocalData);
	const isLoadingRemote = useRPGStore((s) => s.isLoadingRemote);
	const syncError = useRPGStore((s) => s.syncError);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	useEffect(() => {
		console.log("ProtectedLayout useEffect - session:", !!session, "loading:", loading);
		if (loading) return;
		if (!session) {
			console.log("Sessão não encontrada, redirecionando para /auth...");
			clearLocalData();
			void navigate({ to: "/auth", replace: true });
			return;
		}
		void loadRemoteData();
	}, [clearLocalData, loadRemoteData, loading, navigate, session]);

	if (loading || (!session && !loading)) {
		return (
			<div className="flex min-h-screen items-center justify-center text-[13px] text-muted-foreground">
				Carregando sessão...
			</div>
		);
	}

	return (
		<div className="relative flex h-screen overflow-hidden bg-muted/20 sm:p-3 sm:gap-3">
			<div className="pointer-events-none fixed inset-0 -z-10 arcane-grid opacity-[0.05]" />
			
			{/* Mobile Sidebar Overlay */}
			{isSidebarOpen && (
				<div 
					className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Sidebar Island */}
			<div className={cn(
				"fixed inset-y-0 left-0 z-[100] flex flex-col overflow-hidden transition-all duration-300 bg-background md:relative md:z-0 md:flex md:translate-x-0 md:rounded-xl md:border md:border-border/60 md:bg-background/50 md:shadow-2xl md:backdrop-blur-md",
				isSidebarOpen ? "translate-x-0" : "-translate-x-full"
			)}>
				<Sidebar 
					isOpen={isSidebarOpen} 
					onItemClick={() => {
						if (window.innerWidth < 768) {
							setIsSidebarOpen(false);
						}
					}}
				/>
			</div>

			{/* Dashboard Island */}
			<div className="flex flex-1 flex-col overflow-hidden bg-background shadow-2xl shadow-black/20 sm:rounded-xl sm:border sm:border-border/60 sm:bg-background/50 sm:backdrop-blur-md">
				<AppHeader
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
					{syncError && (
						<div className="border-b border-rose-500/20 bg-rose-500/10 px-6 py-2 text-[12px] text-rose-400 font-medium flex items-center gap-2">
							<div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
							Falha ao sincronizar: {syncError}
						</div>
					)}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
