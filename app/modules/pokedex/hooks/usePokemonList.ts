import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "../api/fetchPokemonList";
import { ListPokemonDTO } from "../dto/list-pokemon.dto";
import { Pokemon } from "../entities/pokemon";
import { PaginatedResult } from "../dto/list-pokemon.dto";

export function usePokemonList(filters: ListPokemonDTO) {
  return useQuery<PaginatedResult<Pokemon>, Error>({
    queryKey: [
      "pokedex",
      filters.page ?? 1,
      filters.limit ?? 20,
      filters.search ?? "",
      filters.type ?? "",
      filters.sort ?? "id",
      filters.order ?? "asc",
      filters.types ?? "",
    ],

    queryFn: () => fetchPokemonList(filters),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
