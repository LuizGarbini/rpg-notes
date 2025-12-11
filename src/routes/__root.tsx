import { Sidebar } from "@/components/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex">
				<Sidebar />
				<Outlet />
			</div>
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
		</>
	),
});
