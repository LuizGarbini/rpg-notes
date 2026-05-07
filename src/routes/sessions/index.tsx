import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ListLayout } from "@/components/list-layout";
import { PageHeader } from "@/components/page-header";
import { SessionCard } from "@/components/session-card";
import { SessionForm } from "@/components/session-form";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const sessions = useRPGStore((state) => state.sessions);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSessions = sessions
		.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
		.sort((a, b) => b.createdAt - a.createdAt);

	const isLoading = useRPGStore((state) => state.isLoadingRemote);

	return (
		<div className="w-full">
			<PageHeader
				title="Sessões"
				description="Crônicas das aventuras já vividas pelo grupo"
				Icon={ScrollText}
				iconColor="text-amber-300"
				eyebrow="Crônicas"
				count={sessions.length}
				action={<SessionForm />}
			/>

			<div className="space-y-4 px-6 py-5">
				<ListLayout onSearch={setSearchQuery} />

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{isLoading
						? [...Array(10)].map((_, i) => <SessionCard key={`skeleton-${i}`} isLoading />)
						: filteredSessions.map((session) => (
								<SessionCard key={session.id} session={session} />
						  ))}
					{filteredSessions.length === 0 && (
						<EmptyState
							Icon={ScrollText}
							title="Nenhuma sessão registrada"
							description="Documente o que aconteceu na última partida."
						/>
					)}
				</div>
			</div>
		</div>
	);
}
