"use client";

import { useState } from "react";
import type { PokemonType } from "@modules/pokedex/entities/pokemon";

import { useSearch } from "@/shared/hooks/useSearch";
import { useSorting } from "@/shared/hooks/useSorting";
import { usePagination } from "@/shared/hooks/usePagination";
import { usePokemonList } from "./usePokemonList";
import { usePokedexUrlSync } from "./usePokedexSyncUrl";

const ITEMS_PER_PAGE = 20;

export function usePokedex() {
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);

  const { search, setSearch, debouncedSearch } = useSearch({
    debounceMs: 400,
  });

  const { sortOption, setSortOption, apiSort, apiOrder } = useSorting("id-asc");

  const { page, setPage, nextPage, prevPage } = usePagination({
    initialPage: 1,
  });

  usePokedexUrlSync({
    search,
    setSearch,
    selectedType,
    setSelectedType,
    sortOption,
    setSortOption,
    page,
    setPage,
  });

  const query = usePokemonList({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    type: selectedType || undefined,
    sort: apiSort,
    order: apiOrder,
  });

  return {
    pokemons: query.data?.data ?? [],
    totalPages: query.data?.meta.totalPages ?? 1,

    isLoading: query.isLoading,
    isError: query.isError,

    search,
    setSearch,

    selectedType,
    setSelectedType,

    sortOption,
    setSortOption,

    page,
    setPage,
    nextPage,
    prevPage,
  };
}
