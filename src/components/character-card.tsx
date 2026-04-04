import { Shield, Heart, Sword, FastForward } from "lucide-react";
import type { Character } from "@/lib/store";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-background/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10">
      {/* Decorative Purple Gradient Background */}
      <div className="absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-primary/5 blur-[80px] transition-colors group-hover:bg-primary/10" />

      {/* Header Info */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {character.characterName}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {character.race} • {character.class}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary shadow-inner">
          L{character.level}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {/* HP */}
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Vida
            </span>
            <span className="text-sm font-semibold leading-none">
              {character.health}/{character.healthMax}
            </span>
          </div>
        </div>

        {/* AC */}
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              CA
            </span>
            <span className="text-sm font-semibold leading-none">
              {character.armorClass}
            </span>
          </div>
        </div>

        {/* Initiative */}
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <FastForward className="h-4 w-4 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Iniciativa
            </span>
            <span className="text-sm font-semibold leading-none">
              +{character.initiative}
            </span>
          </div>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2">
          <Sword className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              XP
            </span>
            <span className="text-sm font-semibold leading-none">
              {character.xp}
            </span>
          </div>
        </div>
      </div>

      {/* Background Snippet */}
      {character.background && (
        <div className="mt-auto border-t border-border/40 pt-3">
          <p className="line-clamp-2 text-xs italic text-muted-foreground">
            &quot;{character.background}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
