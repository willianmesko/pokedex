import { cn } from "@/utils/cn";
import { Pokemon } from "@modules/pokedex/entities/pokemon";
import { TypeBadge } from "./TypeBadge";
import { Card } from "@/components/ui/card";
import { TYPE_COLORS } from "@modules/pokedex/constants";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: Pokemon;
  viewMode: "grid" | "list";
  onClick: () => void;
  index: number;
}

export const PokemonCard = ({
  pokemon,
  viewMode,
  onClick,
  index,
}: PokemonCardProps) => {
  const primaryType = pokemon.types[0];
  const typeColorClass = TYPE_COLORS[primaryType];

  if (viewMode === "list") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "group relative flex cursor-pointer items-center gap-4 overflow-hidden border-2 p-4 transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-xl hover:border-primary/50",
          "animate-fade-in"
        )}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div
          className={cn("absolute left-0 top-0 h-full w-1.5", typeColorClass)}
        />

        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted/50 p-2">
          <Image
            src={pokemon.imagePath}
            alt={pokemon.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
            width={80}
            height={80}
            loading="lazy"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
            <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden border-2 transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl hover:border-primary/50",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20",
          typeColorClass
        )}
      />

      <div className="absolute right-2 top-2 z-10 rounded-full bg-card/90 px-2 py-0.5 text-xs font-mono font-semibold text-muted-foreground backdrop-blur-sm">
        #{pokemon.id.toString().padStart(3, "0")}
      </div>

      <div className="relative flex aspect-square items-center justify-center p-4">
        <Image
          src={pokemon.imagePath}
          alt={pokemon.name}
          className="h-full w-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
          loading="lazy"
          width={130}
          height={100}
        />

        <div
          className={cn(
            "absolute inset-0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30",
            typeColorClass
          )}
        />
      </div>

      <div className="relative space-y-2 border-t bg-card/80 p-3 backdrop-blur-sm">
        <h3 className="text-center text-sm font-bold capitalize md:text-base">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>
    </Card>
  );
};
