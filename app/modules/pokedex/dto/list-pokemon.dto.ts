export type PokemonSort = "id" | "name" | "types";

export interface ListPokemonDTO {
  search?: string;
  type?: string;
  sort?: "id" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  types?: string;
}
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
