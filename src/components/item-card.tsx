import { Sparkles, Swords } from "lucide-react";
import type { Item } from "@/lib/store";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  // Let's create a subtle border color based on some standard rarities logic
  // but fallback to primary for safety.
  const rarityLower = item.rarity?.toLowerCase() || "";
  let rarityColorTwClass = "text-primary";
  let rarityBgClass = "bg-primary/10";
  let rarityBorderClass = "border-primary/20";

  if (rarityLower.includes("lendário") || rarityLower.includes("legendary")) {
    rarityColorTwClass = "text-yellow-500";
    rarityBgClass = "bg-yellow-500/10";
    rarityBorderClass = "border-yellow-500/30";
  } else if (rarityLower.includes("raro") || rarityLower.includes("rare")) {
    rarityColorTwClass = "text-blue-500";
    rarityBgClass = "bg-blue-500/10";
    rarityBorderClass = "border-blue-500/30";
  } else if (rarityLower.includes("incomum") || rarityLower.includes("uncommon")) {
    rarityColorTwClass = "text-emerald-500";
    rarityBgClass = "bg-emerald-500/10";
    rarityBorderClass = "border-emerald-500/30";
  }

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${rarityBorderClass} bg-background/50 p-5 shadow-sm transition-all hover:shadow-md`}>
      <div className={`absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${rarityColorTwClass}`} />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {item.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rarityBgClass} ${rarityColorTwClass}`}>
              {item.rarity || "Comum"}
            </span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Swords className="w-3 h-3" /> {item.type || "Desconhecido"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Atributos / Efeitos
            </span>
            <span className="text-sm font-semibold leading-none">
              {item.stats || "-"}
            </span>
          </div>
        </div>
      </div>

      {item.description && (
        <div className="mt-auto border-t border-border/40 pt-3">
          <p className="line-clamp-2 text-xs italic text-muted-foreground">
            &quot;{item.description}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
