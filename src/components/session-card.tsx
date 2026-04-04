import { Calendar, ScrollText } from "lucide-react";
import type { Session } from "@/lib/store";

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-background/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10">
      <div className="absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {session.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3 text-primary" /> {session.date || "Sem data definida"}
        </p>
      </div>

      <div className="mt-2 bg-background/50 rounded-lg p-3 border border-border/50 relative">
        <ScrollText className="w-4 h-4 text-muted-foreground absolute top-3 right-3 opacity-30" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
          Resumo dos Acontecimentos
        </span>
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {session.summary || "Nenhum resumo adicionado."}
        </p>
      </div>
    </div>
  );
}
