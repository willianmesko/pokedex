import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

import { usePokemonList } from "../usePokemonList";
import { fetchPokemonList } from "../../api/fetchPokemonList";
import type {
  PaginatedResult,
  ListPokemonDTO,
} from "../../dto/list-pokemon.dto";
import type { Pokemon } from "../../entities/pokemon";

vi.mock("../../api/fetchPokemonList");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "QueryClientTestWrapper";

  return Wrapper;
}

describe("usePokemonList", () => {
  const filters: ListPokemonDTO = {
    page: 1,
    limit: 20,
    search: "",
    type: "",
    sort: "id",
    order: "asc",
  };

  it("fetches pokemon list successfully", async () => {
    const mockResult: PaginatedResult<Pokemon> = {
      data: [
        {
          id: 1,
          name: "Bulbasaur",
          types: ["grass"],
          imagePath: "",
          height: 0,
          weight: 0,
          stats: [],
          abilities: [],
        },
      ],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };

    vi.mocked(fetchPokemonList).mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => usePokemonList(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResult);
  });
});
