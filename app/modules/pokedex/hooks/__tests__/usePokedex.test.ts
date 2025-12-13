import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { usePokedex } from "../usePokedex";
import type { Pokemon } from "@modules/pokedex/entities/pokemon";

vi.mock("@/shared/hooks/useSearch", () => ({
  useSearch: () => ({
    search: "pikachu",
    setSearch: vi.fn(),
    debouncedSearch: "pikachu",
  }),
}));

vi.mock("@/shared/hooks/useSorting", () => ({
  useSorting: () => ({
    sortOption: "id-asc",
    setSortOption: vi.fn(),
    apiSort: "id",
    apiOrder: "asc",
  }),
}));

vi.mock("@/shared/hooks/usePagination", () => ({
  usePagination: () => ({
    page: 1,
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
  }),
}));

vi.mock("../usePokedexSyncUrl", () => ({
  usePokedexUrlSync: vi.fn(),
}));

const usePokemonListMock = vi.fn();

vi.mock("../usePokemonList", () => ({
  usePokemonList: (args: unknown) => usePokemonListMock(args),
}));

describe("usePokedex", () => {
  it("returns pokedex state and calls usePokemonList with correct params", () => {
    const mockPokemons: Pokemon[] = [
      {
        id: 25,
        name: "Pikachu",
        types: ["electric"],
        imagePath: "",
        height: 4,
        weight: 60,
        stats: [],
        abilities: [],
      },
    ];

    usePokemonListMock.mockReturnValue({
      data: {
        data: mockPokemons,
        meta: { totalPages: 5 },
      },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => usePokedex());

    expect(usePokemonListMock).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "pikachu",
      type: undefined,
      sort: "id",
      order: "asc",
    });

    expect(result.current.pokemons).toEqual(mockPokemons);
    expect(result.current.totalPages).toBe(5);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);

    expect(result.current.search).toBe("pikachu");
    expect(result.current.sortOption).toBe("id-asc");
    expect(result.current.page).toBe(1);

    expect(typeof result.current.setSearch).toBe("function");
    expect(typeof result.current.setSelectedType).toBe("function");
    expect(typeof result.current.nextPage).toBe("function");
    expect(typeof result.current.prevPage).toBe("function");
  });
});
