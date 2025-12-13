import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { usePokedexUrlSync } from "../usePokedexSyncUrl";
import type { SortOption } from "@/shared/hooks/useSorting";
import type { PokemonType } from "../../entities/pokemon";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () =>
    new URLSearchParams({
      search: "pikachu",
      type: "electric",
      sort: "name-desc",
      page: "2",
    }),
}));

describe("usePokedexUrlSync", () => {
  it("hydrates state from URL on first render", () => {
    const setSearch = vi.fn();
    const setSelectedType = vi.fn();
    const setSortOption = vi.fn();
    const setPage = vi.fn();

    renderHook(() =>
      usePokedexUrlSync({
        search: "",
        setSearch,
        selectedType: null,
        setSelectedType,
        sortOption: "id-asc",
        setSortOption,
        page: 1,
        setPage,
      })
    );

    expect(setSearch).toHaveBeenCalledWith("pikachu");
    expect(setSelectedType).toHaveBeenCalledWith("electric");
    expect(setSortOption).toHaveBeenCalledWith("name-desc");
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("updates URL when state changes after hydration", () => {
    const setSearch = vi.fn();
    const setSelectedType = vi.fn();
    const setSortOption = vi.fn();
    const setPage = vi.fn();

    const { rerender } = renderHook(
      ({
        search,
        selectedType,
        sortOption,
        page,
      }: {
        search: string;
        selectedType: PokemonType | null;
        sortOption: SortOption;
        page: number;
      }) =>
        usePokedexUrlSync({
          search,
          setSearch,
          selectedType,
          setSelectedType,
          sortOption,
          setSortOption,
          page,
          setPage,
        }),
      {
        initialProps: {
          search: "",
          selectedType: null,
          sortOption: "id-asc",
          page: 1,
        },
      }
    );

    rerender({
      search: "bulbasaur",
      selectedType: "grass",
      sortOption: "name-asc",
      page: 3,
    });

    expect(replaceMock).toHaveBeenCalledWith(
      "?search=bulbasaur&type=grass&sort=name-asc&page=3",
      { scroll: false }
    );
  });
});
