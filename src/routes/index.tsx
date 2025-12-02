import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/sidebar";
export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="flex p-8">
			<Sidebar />
			<h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
			<span className="mt-1 text-sm text-muted-foreground">
				Bem-vindo ao seu grimório digital
			</span>
		</div>
	);
}
