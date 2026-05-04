import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	const location = useLocation();
	const isLanding = location.pathname === "/";
	const isAuth = location.pathname === "/auth";

	if (isLanding || isAuth) {
		return <Outlet />;
	}

	return (
		<div className="relative flex min-h-screen">
			<div className="pointer-events-none fixed inset-0 -z-10 arcane-grid opacity-[0.07]" />
			<Sidebar />
			<main className="relative z-10 flex-1">
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
