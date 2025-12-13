import type { Pokemon, PokemonStat } from "../../entities/pokemon";
import { ListPokemonDTO } from "../../dto/list-pokemon.dto";
import { PokemonRepository } from "../repositories/pokemon.repository";
import { DatabaseError } from "@/shared/errors/database-error";

export type PokemonRow = {
  id: number;
  name: string;
  types: string;
  imagePath: string;
  height: number | null;
  weight: number | null;
  stats: PokemonStat[] | null;
};

export class PokemonService {
  constructor(private readonly repository = new PokemonRepository()) {}

  private mapToDomain(row: PokemonRow): Pokemon {
    return {
      id: row.id,
      name: row.name,
      types: row.types.split(",") as Pokemon["types"],
      imagePath: row.imagePath,
      height: row.height ?? 0,
      weight: row.weight ?? 0,
      stats: row.stats ?? [],
      abilities: [],
    };
  }

  async list(dto: ListPokemonDTO = {}): Promise<{
    data: Pokemon[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const {
      search,
      type,
      sort = "id",
      order = "asc",
      page = 1,
      limit = 20,
    } = dto;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    try {
      const { rows, total } = await this.repository.findPaginated({
        search,
        type,
        sort,
        order,
        page: safePage,
        limit: safeLimit,
      });

      return {
        data: rows.map((row) => this.mapToDomain(row as PokemonRow)),
        meta: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      };
    } catch (err) {
      throw new DatabaseError("Failed to list pokémon", err);
    }
  }
}
