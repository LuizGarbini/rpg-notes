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
		if (loading) return;
		if (!session) {
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
		<div className="relative flex min-h-screen">
			<div className="pointer-events-none fixed inset-0 -z-10 arcane-grid opacity-[0.07]" />
			<Sidebar isOpen={isSidebarOpen} />
			<div className="flex flex-1 flex-col">
				<AppHeader
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<main className="relative z-10 flex-1">
					{(isLoadingRemote || syncError) && (
						<div className="border-b border-border bg-card-elevated/60 px-6 py-2 text-[12px] text-muted-foreground">
							{syncError
								? `Falha ao sincronizar: ${syncError}`
								: "Sincronizando dados do Supabase..."}
						</div>
					)}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
