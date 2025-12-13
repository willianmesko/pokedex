import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TYPE_COLORS, STAT_LABELS } from "@modules/pokedex/constants";
import type { Pokemon } from "@modules/pokedex/entities/pokemon";
import { TypeBadge } from "./TypeBadge";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Image from "next/image";

interface PokemonDetailModalProps {
  pokemon: Pokemon | null;
  open: boolean;
  onClose: () => void;
}

const StatBar = ({
  label,
  value,
  maxValue = 255,
}: {
  label: string;
  value: number;
  maxValue?: number;
}) => {
  const percentage = (value / maxValue) * 100;

  const getStatColor = () => {
    if (percentage >= 70) return "bg-pokemon-grass";
    if (percentage >= 50) return "bg-pokemon-electric";
    if (percentage >= 30) return "bg-pokemon-fire";
    return "bg-pokemon-fighting";
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs font-medium text-muted-foreground uppercase">
        {label}
      </span>
      <span className="w-10 text-sm font-bold text-foreground">{value}</span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getStatColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const PokemonDetailModal = ({
  pokemon,
  open,
  onClose,
}: PokemonDetailModalProps) => {
  if (!pokemon) return null;

  const primaryType = pokemon.types[0];
  const typeColorClass = TYPE_COLORS[primaryType];

  const totalStats = pokemon.stats.reduce(
    (sum, stat) => sum + (stat.value as number),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0 gap-0">
        <div className={cn("relative pt-8 pb-16", typeColorClass)}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/40"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-sm font-mono font-bold text-white">
            #{pokemon.id.toString().padStart(3, "0")}
          </div>

          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
            <div className="relative">
              <Image
                src={pokemon.imagePath}
                alt={pokemon.name}
                className="h-40 w-40 object-contain drop-shadow-2xl animate-float"
                width={160}
                height={160}
              />
              <div
                className={cn(
                  "absolute inset-0 blur-2xl opacity-50",
                  typeColorClass
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-card px-6 pt-20 pb-6 space-y-6">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold capitalize">
              {pokemon.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details for {pokemon.name}
            </DialogDescription>
            <div className="flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>
          </DialogHeader>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-lg font-bold">
                {(pokemon.height / 10).toFixed(1)} m
              </div>
              <div className="text-xs text-muted-foreground">Height</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="text-lg font-bold">
                {(pokemon.weight / 10).toFixed(1)} kg
              </div>
              <div className="text-xs text-muted-foreground">Weight</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Base Stats
            </h4>
            <div className="space-y-2">
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.name}
                  label={STAT_LABELS[stat.name] || stat.name}
                  value={stat.value as number}
                />
              ))}
            </div>
            <div className="pt-2 text-center">
              <span className="text-sm text-muted-foreground">Total: </span>
              <span className="font-bold text-foreground">{totalStats}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
