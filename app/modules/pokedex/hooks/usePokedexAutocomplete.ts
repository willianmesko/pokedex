import { useQuery } from "@tanstack/react-query";
import { fetchPokemonAutocomplete } from "../api/fetchPokemonAutoComplete";

export function usePokedexAutocomplete(search: string) {
  return useQuery({
    queryKey: ["pokedex-autocomplete", search],
    queryFn: () => fetchPokemonAutocomplete(search),
    enabled: search.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
