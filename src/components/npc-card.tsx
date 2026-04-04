import { MapPin, User, Pickaxe } from "lucide-react";
import type { Npc } from "@/lib/store";

interface NpcCardProps {
  npc: Npc;
}

export function NpcCard({ npc }: NpcCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-background/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10">
      <div className="absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {npc.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" /> {npc.race}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <Pickaxe className="h-4 w-4 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Papel / Ocupação
            </span>
            <span className="text-sm font-semibold leading-none truncate">
              {npc.role || "-"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <MapPin className="h-4 w-4 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Localização
            </span>
            <span className="text-sm font-semibold leading-none truncate">
              {npc.location || "-"}
            </span>
          </div>
        </div>
      </div>

      {npc.description && (
        <div className="mt-auto border-t border-border/40 pt-3">
          <p className="line-clamp-2 text-xs italic text-muted-foreground">
            &quot;{npc.description}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
