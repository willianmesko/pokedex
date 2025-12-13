import { z } from "zod";

export const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export const listPokemonQuerySchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  sort: z.enum(["id", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type ListPokemonQuery = z.infer<typeof listPokemonQuerySchema>;
