import { Pokemon } from "../entities/pokemon";
import { cn } from "@/utils/cn";
import { PokemonCard } from "./PokemonCard";
import { PokemonCardSkeleton } from "./PokemonCardSkeleton";

interface PokedexContentProps {
  pokemons: Pokemon[];
  viewMode: "grid" | "list";
  isLoading: boolean;
  isError: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

const ITEMS_PER_PAGE = 20;
export function PokedexContent({
  pokemons,
  viewMode,
  isLoading,
  isError,
  onSelect,
}: PokedexContentProps) {
  if (isLoading) {
    return Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <PokemonCardSkeleton key={i} viewMode={viewMode} />
    ));
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load Pokémon
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-semibold">No Pokémon found</h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          : "flex flex-col gap-3"
      )}
    >
      {pokemons.map((pokemon, index) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          viewMode={viewMode}
          index={index}
          onClick={() => onSelect(pokemon)}
        />
      ))}
    </div>
  );
}
