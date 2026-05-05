import {
	createRootRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useRPGStore } from "@/lib/store";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

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
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
			<Sidebar />
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
			{/* <TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/> */}
		</div>
	);
}
