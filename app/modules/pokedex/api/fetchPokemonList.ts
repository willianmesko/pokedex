import { ListPokemonDTO, PaginatedResult } from "../dto/list-pokemon.dto";
import { Pokemon } from "../entities/pokemon";
import { ENDPOINTS } from "@/shared/utils/endpoints";

export async function fetchPokemonList(
  filters: ListPokemonDTO
): Promise<PaginatedResult<Pokemon>> {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined) as [
      string,
      string
    ][]
  );

  const res = await fetch(`${ENDPOINTS.POKEDEX_LIST}?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch pokedex");
  }

  return res.json();
}
