import { Pokemon } from "../entities/pokemon";
import { ENDPOINTS } from "@/shared/utils/endpoints";

export async function fetchPokemonAutocomplete(search: string) {
  if (!search) return [];

  const res = await fetch(
    `${ENDPOINTS.POKEDEX_AUTOCOMPLETE}?search=${encodeURIComponent(search)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch autocomplete");
  }

  return res.json() as Promise<Pick<Pokemon, "id" | "name">[]>;
}
