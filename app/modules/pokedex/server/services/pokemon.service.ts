import { DatabaseError } from "@/app/shared/errors/database-error";
import { PokemonRepository } from "../repositories/pokemon.repository";
import { ListPokemonDTO } from "../../dto/list-pokemon.dto";
import { Pokemon, PokemonStat } from "../../entities/pokemon";

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

  async list(dto: ListPokemonDTO = {}) {
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

  async autocomplete(search: string, limit = 8) {
    if (!search || search.trim().length < 2) {
      return [];
    }

    try {
      return await this.repository.autocomplete(search, limit);
    } catch (err) {
      throw new DatabaseError("Failed to autocomplete pokémon", err);
    }
  }

  // private async loadTrie() {
  //   if (this.trie) return;

  //   const items = await this.repository.findAllNamesSorted();
  //   this.trie = new PrefixTree();

  //   for (const item of items) {
  //     this.trie.insert(item.name, item);
  //   }
  // }

  // async autocompleteTrie(search: string, limit = 8) {
  //   if (search.length < 2) return [];

  //   await this.loadTrie();

  //   return this.trie!.search(search, limit);
  // }
}
