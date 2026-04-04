import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListLayout } from "@/components/list-layout";
import { SessionForm } from "@/components/session-form";
import { SessionCard } from "@/components/session-card";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const sessions = useRPGStore((state) => state.sessions);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSessions = sessions.filter((s) =>
		s.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-1">
			<div className="w-full max-h-full">
				<div className="py-6 px-8 h-full">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-3xl font-bold">Sessões</h2>
								<span className="mt-1 text-sm text-muted-foreground">
									Gerencie os acontecimentos das sessões
								</span>
							</div>
							<SessionForm />
						</div>
						<ListLayout onSearch={setSearchQuery} />

						<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredSessions.map((session) => (
								<SessionCard key={session.id} session={session} />
							))}
							{filteredSessions.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground">
									Nenhuma sessão encontrada.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
