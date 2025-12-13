"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/shared/hooks/useSorting";
import type { PokemonType } from "../entities/pokemon";

interface UsePokedexUrlSyncParams {
  search: string;
  setSearch: (v: string) => void;

  selectedType: PokemonType | null;
  setSelectedType: (v: PokemonType | null) => void;

  sortOption: SortOption;
  setSortOption: (v: SortOption) => void;

  page: number;
  setPage: (v: number) => void;
}

export function usePokedexUrlSync({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  sortOption,
  setSortOption,
  page,
  setPage,
}: UsePokedexUrlSyncParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (isHydratedRef.current) return;

    const urlSearch = searchParams.get("search");
    const urlType = searchParams.get("type") as PokemonType | null;
    const urlSort = searchParams.get("sort") as SortOption | null;
    const urlPage = searchParams.get("page");

    if (urlSearch) setSearch(urlSearch);
    if (urlType) setSelectedType(urlType);
    if (urlSort) setSortOption(urlSort);
    if (urlPage && !isNaN(Number(urlPage))) {
      setPage(Number(urlPage));
    }

    isHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isHydratedRef.current) return;

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedType) params.set("type", selectedType);
    if (sortOption !== "id-asc") params.set("sort", sortOption);
    if (page > 1) params.set("page", String(page));

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, selectedType, sortOption, page]);
}
