import { BookOpen, Bookmark } from "lucide-react";
import type { Lore } from "@/lib/store";

interface LoreCardProps {
  lore: Lore;
}

export function LoreCard({ lore }: LoreCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-md border-x-4 border-l-primary border-y border-y-border border-r-border/50 bg-background/80 p-5 shadow-sm transition-all hover:bg-background hover:shadow-md">
      <div className="absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Bookmark className="absolute top-0 right-4 h-6 w-6 text-primary/30 group-hover:text-primary transition-colors" />

      <div className="mb-4 pr-6">
        <h3 className="text-xl font-serif font-bold tracking-tight text-foreground">
          {lore.title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-widest text-primary/80 flex items-center gap-1">
          {lore.category || "General"}
        </p>
      </div>

      <div className="flex-1 rounded bg-secondary/50 p-4 font-serif text-sm leading-relaxed text-foreground/90 border border-border/30 relative">
        <BookOpen className="absolute -left-2 -top-2 h-6 w-6 text-muted-foreground/20 rotate-12" />
        <p className="line-clamp-6 whitespace-pre-line relative z-10">
          {lore.content || "Sem conteúdo manuscrito..."}
        </p>
      </div>
    </div>
  );
}
