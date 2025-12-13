import { describe, it, expect, beforeEach, vi } from "vitest";
import { PokemonRepository, FindPaginatedParams } from "./pokemon.repository";
import prisma from "@/shared/lib/db";
import { Prisma } from "@prisma/client";

vi.mock("@/shared/lib/db", () => ({
  default: {
    pokemon: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

type PokemonQueryResult = {
  id: number;
  name: string;
  types: string;
  imagePath: string;
  height: number | null;
  weight: number | null;
  stats: Prisma.JsonValue | null;
};

describe("PokemonRepository", () => {
  let repository: PokemonRepository;

  beforeEach(() => {
    repository = new PokemonRepository();
    vi.clearAllMocks();
  });

  describe("findPaginated", () => {
    const mockPokemonData: PokemonQueryResult[] = [
      {
        id: 1,
        name: "Bulbasaur",
        types: "grass,poison",
        imagePath: "/bulbasaur.png",
        height: 7,
        weight: 69,
        stats: [
          { name: "hp", value: 45 },
          { name: "attack", value: 49 },
          { name: "defense", value: 49 },
        ],
      },
      {
        id: 4,
        name: "Charmander",
        types: "fire",
        imagePath: "/charmander.png",
        height: 6,
        weight: 85,
        stats: [
          { name: "hp", value: 39 },
          { name: "attack", value: 52 },
          { name: "defense", value: 43 },
        ],
      },
    ];

    it("should return paginated results with default parameters", async () => {
      const params: FindPaginatedParams = {
        sort: "id",
        order: "asc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue(
        mockPokemonData as never
      );
      vi.mocked(prisma.pokemon.count).mockResolvedValue(2);

      const result = await repository.findPaginated(params);

      expect(result).toEqual({
        rows: mockPokemonData,
        total: 2,
      });

      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { id: "asc" },
        skip: 0,
        take: 10,
        select: {
          id: true,
          name: true,
          types: true,
          imagePath: true,
          height: true,
          weight: true,
          stats: true,
        },
      });

      expect(prisma.pokemon.count).toHaveBeenCalledWith({
        where: {},
      });
    });

    it("should filter by search term (case insensitive)", async () => {
      const params: FindPaginatedParams = {
        search: "Char",
        sort: "name",
        order: "asc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue([
        mockPokemonData[1],
      ] as never);
      vi.mocked(prisma.pokemon.count).mockResolvedValue(1);

      const result = await repository.findPaginated(params);

      expect(result.rows).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("should filter by type (case insensitive)", async () => {
      const params: FindPaginatedParams = {
        type: "Fire",
        sort: "id",
        order: "asc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue([
        mockPokemonData[1],
      ] as never);
      vi.mocked(prisma.pokemon.count).mockResolvedValue(1);

      const result = await repository.findPaginated(params);

      expect(result.rows).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("should filter by both search and type", async () => {
      const params: FindPaginatedParams = {
        search: "Char",
        type: "Fire",
        sort: "id",
        order: "desc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue([
        mockPokemonData[1],
      ] as never);
      vi.mocked(prisma.pokemon.count).mockResolvedValue(1);

      await repository.findPaginated(params);

      expect(prisma.pokemon.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: "Char",
            mode: Prisma.QueryMode.insensitive,
          },
          types: {
            contains: "Fire",
            mode: Prisma.QueryMode.insensitive,
          },
        },
        orderBy: { id: "desc" },
        skip: 0,
        take: 10,
        select: {
          id: true,
          name: true,
          types: true,
          imagePath: true,
          height: true,
          weight: true,
          stats: true,
        },
      });
    });

    it("should handle pagination correctly - page 1", async () => {
      const params: FindPaginatedParams = {
        sort: "id",
        order: "asc",
        page: 1,
        limit: 5,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue(
        mockPokemonData as never
      );
      vi.mocked(prisma.pokemon.count).mockResolvedValue(10);

      await repository.findPaginated(params);

      expect(prisma.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 5,
        })
      );
    });

    it("should handle pagination correctly - page 2", async () => {
      const params: FindPaginatedParams = {
        sort: "id",
        order: "asc",
        page: 2,
        limit: 5,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue(
        mockPokemonData as never
      );
      vi.mocked(prisma.pokemon.count).mockResolvedValue(10);

      await repository.findPaginated(params);

      expect(prisma.pokemon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
    });

    it("should return empty results when no pokemon match filters", async () => {
      const params: FindPaginatedParams = {
        search: "NonexistentPokemon",
        sort: "id",
        order: "asc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue([] as never);
      vi.mocked(prisma.pokemon.count).mockResolvedValue(0);

      const result = await repository.findPaginated(params);

      expect(result).toEqual({
        rows: [],
        total: 0,
      });
    });

    it("should handle database errors gracefully", async () => {
      const params: FindPaginatedParams = {
        sort: "id",
        order: "asc",
        page: 1,
        limit: 10,
      };

      const dbError = new Error("Database connection failed");
      vi.mocked(prisma.pokemon.findMany).mockRejectedValue(dbError);

      await expect(repository.findPaginated(params)).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should handle count errors gracefully", async () => {
      const params: FindPaginatedParams = {
        sort: "id",
        order: "asc",
        page: 1,
        limit: 10,
      };

      vi.mocked(prisma.pokemon.findMany).mockResolvedValue(
        mockPokemonData as never
      );
      vi.mocked(prisma.pokemon.count).mockRejectedValue(
        new Error("Count failed")
      );

      await expect(repository.findPaginated(params)).rejects.toThrow(
        "Count failed"
      );
    });
  });
});
