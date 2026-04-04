import { Map, AlertTriangle } from "lucide-react";
import type { GameLocation } from "@/lib/store";

interface LocationCardProps {
  location: GameLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  const isHighDanger = location.dangerLevel?.toLowerCase().includes("alto");
  const dangerColor = isHighDanger ? "text-rose-500" : "text-amber-500";
  const dangerBorder = isHighDanger ? "border-rose-500/50" : "border-border/50";

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${dangerBorder} bg-background/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md`}>
      <div className={`absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isHighDanger ? 'text-rose-500' : 'text-primary'}`} />

      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {location.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Map className="w-3 h-3 text-primary" /> {location.type || "Desconhecido"}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <AlertTriangle className={`h-4 w-4 ${dangerColor}`} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Nível de Perigo
            </span>
            <span className="text-sm font-semibold leading-none">
              {location.dangerLevel || "-"}
            </span>
          </div>
        </div>
      </div>

      {location.description && (
        <div className="mt-auto border-t border-border/40 pt-3">
          <p className="line-clamp-2 text-xs italic text-muted-foreground">
            &quot;{location.description}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
