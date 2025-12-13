"use client";

import type { Pokemon } from "@modules/pokedex/entities/pokemon";

import { PokemonDetailModal } from "@modules/pokedex/components/PokedexDetailModal";
import { PokedexHeader } from "@modules/pokedex/components/pokedexHeader";
import { AppPagination } from "@/shared/components/AppPagination";

import { useCallback, useState } from "react";
import { usePokedex } from "@modules/pokedex/hooks/usePokedex";
import { PokedexContent } from "@modules/pokedex/components/PokedexContent";
import { PokedexToolbar } from "../modules/pokedex/components/PokedexFilters";

const PokedexPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const {
    pokemons,
    isLoading,
    isError,

    search,
    setSearch,

    selectedType,
    setSelectedType,

    sortOption,
    setSortOption,

    page,
    totalPages,
    nextPage,
    prevPage,
    setPage,
  } = usePokedex();

  const handleSelectPokemon = useCallback(
    (pokemon: Pokemon) => setSelectedPokemon(pokemon),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <PokedexHeader />

      <PokedexToolbar
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />
      <main className="container pb-8">
        <PokedexContent
          pokemons={pokemons}
          viewMode={viewMode}
          isLoading={isLoading}
          isError={isError}
          onSelect={handleSelectPokemon}
        />
      </main>

      {totalPages > 1 && (
        <AppPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      )}

      <PokemonDetailModal
        pokemon={selectedPokemon}
        open={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
};

export default PokedexPage;
