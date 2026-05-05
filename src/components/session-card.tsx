import { Calendar, Clock, ScrollText, Users } from "lucide-react";
import { useState } from "react";
import type { Session } from "@/lib/store";
import { useRPGStore } from "@/lib/store";
import { EntityActions } from "./entity-actions";
import { SessionEditButton } from "./session-form";

interface SessionCardProps {
	session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
	const removeSession = useRPGStore((s) => s.removeSession);
	const [editOpen, setEditOpen] = useState(false);

	return (
		<div className="flex flex-col">
			<div className="group relative flex flex-col rounded-xl border border-border bg-card-elevated p-4 transition-colors hover:border-border-hover">
				<EntityActions
					onEdit={() => setEditOpen(true)}
					onDelete={() => removeSession(session.id)}
					entityName={session.title || `Sessão #${session.number}`}
					entityKindLabel="sessão"
				/>

				<div className="flex items-start gap-3">
					<div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20">
						<span className="text-[8px] font-semibold uppercase tracking-wider opacity-70">
							Sessão
						</span>
						<span className="font-mono text-[14px] font-bold leading-none">
							#{session.number}
						</span>
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="font-display truncate text-[15px] font-bold text-foreground">
							{session.title || "Sem título"}
						</h3>
						<div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
							{session.date && (
								<span className="flex items-center gap-1">
									<Calendar className="h-2.5 w-2.5 text-amber-300" />
									{session.date}
								</span>
							)}
							{session.duration && (
								<span className="flex items-center gap-1">
									<Clock className="h-2.5 w-2.5" />
									{session.duration}
								</span>
							)}
						</div>
						<div className="mt-1.5 flex flex-wrap items-center gap-1">
							{session.mood && (
								<span className="rounded bg-muted/50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground ring-1 ring-border">
									{session.mood}
								</span>
							)}
							{session.inGameDate && (
								<span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/20">
									{session.inGameDate}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="mt-3 rounded-md bg-background/40 p-3 ring-1 ring-border/60">
					<div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
						<ScrollText className="h-2.5 w-2.5" />
						Resumo
					</div>
					<p className="font-display text-[12px] leading-relaxed text-foreground/90 line-clamp-5 whitespace-pre-line">
						{session.summary || "Nenhum resumo registrado."}
					</p>
				</div>

				{session.attendees && (
					<div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
						<Users className="h-3 w-3 text-emerald-300" />
						<span className="line-clamp-1">{session.attendees}</span>
					</div>
				)}

				{session.cliffhanger && (
					<p className="mt-2 line-clamp-2 border-t border-border/60 pt-2 text-[10px] italic text-amber-300/80">
						“{session.cliffhanger}”
					</p>
				)}
			</div>

			<SessionEditButton
				session={session}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={null}
			/>
		</div>
	);
}
