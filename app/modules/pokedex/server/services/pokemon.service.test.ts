import { describe, it, expect, beforeEach, vi } from "vitest";
import { PokemonService, PokemonRow } from "./pokemon.service";
import { PokemonRepository } from "../repositories/pokemon.repository";
import { ListPokemonDTO } from "../../dto/list-pokemon.dto";
import { DatabaseError } from "@/shared/errors/database-error";
import type { Pokemon } from "../../entities/pokemon";

vi.mock("../repositories/pokemon.repository");

describe("PokemonService", () => {
  let service: PokemonService;
  let mockRepository: {
    findPaginated: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepository = {
      findPaginated: vi.fn(),
    };
    service = new PokemonService(
      mockRepository as unknown as PokemonRepository
    );
  });

  describe("list", () => {
    const mockRows: PokemonRow[] = [
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

    const expectedMappedData: Pokemon[] = [
      {
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        imagePath: "/bulbasaur.png",
        height: 7,
        weight: 69,
        stats: [
          { name: "hp", value: 45 },
          { name: "attack", value: 49 },
          { name: "defense", value: 49 },
        ],
        abilities: [],
      },
      {
        id: 4,
        name: "Charmander",
        types: ["fire"],
        imagePath: "/charmander.png",
        height: 6,
        weight: 85,
        stats: [
          { name: "hp", value: 39 },
          { name: "attack", value: 52 },
          { name: "defense", value: 43 },
        ],
        abilities: [],
      },
    ];

    it("should return paginated pokemon with default parameters", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list();

      expect(result).toEqual({
        data: expectedMappedData,
        meta: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      });

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        search: undefined,
        type: undefined,
        sort: "id",
        order: "asc",
        page: 1,
        limit: 20,
      });
    });

    it("should apply custom search and type filters", async () => {
      const dto: ListPokemonDTO = {
        search: "Char",
        type: "fire",
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [mockRows[1]],
        total: 1,
      });

      const result = await service.list(dto);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Charmander");

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        search: "Char",
        type: "fire",
        sort: "id",
        order: "asc",
        page: 1,
        limit: 20,
      });
    });

    it("should apply custom sorting", async () => {
      const dto: ListPokemonDTO = {
        sort: "name",
        order: "desc",
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      await service.list(dto);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        search: undefined,
        type: undefined,
        sort: "name",
        order: "desc",
        page: 1,
        limit: 20,
      });
    });

    it("should apply custom pagination", async () => {
      const dto: ListPokemonDTO = {
        page: 2,
        limit: 10,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [],
        total: 15,
      });

      const result = await service.list(dto);

      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 15,
        totalPages: 2,
      });

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        search: undefined,
        type: undefined,
        sort: "id",
        order: "asc",
        page: 2,
        limit: 10,
      });
    });

    it("should enforce minimum page of 1", async () => {
      const dto: ListPokemonDTO = {
        page: 0,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list(dto);

      expect(result.meta.page).toBe(1);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
        })
      );
    });

    it("should enforce minimum page of 1 for negative values", async () => {
      const dto: ListPokemonDTO = {
        page: -5,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list(dto);

      expect(result.meta.page).toBe(1);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
        })
      );
    });

    it("should enforce maximum limit of 50", async () => {
      const dto: ListPokemonDTO = {
        limit: 100,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list(dto);

      expect(result.meta.limit).toBe(50);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
        })
      );
    });

    it("should enforce minimum limit of 1", async () => {
      const dto: ListPokemonDTO = {
        limit: 0,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list(dto);

      expect(result.meta.limit).toBe(1);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 1,
        })
      );
    });

    it("should calculate total pages correctly", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 45,
      });

      const result = await service.list({ limit: 10 });

      expect(result.meta.totalPages).toBe(5); // Math.ceil(45 / 10) = 5
    });

    it("should handle total pages when total is 0", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: [],
        total: 0,
      });

      const result = await service.list();

      expect(result.meta.totalPages).toBe(0);
    });

    it("should map database rows to domain entities correctly", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list();

      expect(result.data[0]).toEqual({
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        imagePath: "/bulbasaur.png",
        height: 7,
        weight: 69,
        stats: mockRows[0].stats,
        abilities: [],
      });
    });

    it("should handle null height by defaulting to 0", async () => {
      const rowWithNullHeight: PokemonRow = {
        ...mockRows[0],
        height: null,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithNullHeight],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0].height).toBe(0);
    });

    it("should handle null weight by defaulting to 0", async () => {
      const rowWithNullWeight: PokemonRow = {
        ...mockRows[0],
        weight: null,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithNullWeight],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0].weight).toBe(0);
    });

    it("should handle null stats by defaulting to empty array", async () => {
      const rowWithNullStats: PokemonRow = {
        ...mockRows[0],
        stats: null,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithNullStats],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0].stats).toEqual([]);
    });

    it("should handle all null optional fields", async () => {
      const rowWithNulls: PokemonRow = {
        id: 1,
        name: "Missingno",
        types: "unknown",
        imagePath: "/missingno.png",
        height: null,
        weight: null,
        stats: null,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithNulls],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0]).toEqual({
        id: 1,
        name: "Missingno",
        types: ["unknown"],
        imagePath: "/missingno.png",
        height: 0,
        weight: 0,
        stats: [],
        abilities: [],
      });
    });

    it("should split types string into array correctly", async () => {
      const rowWithMultipleTypes: PokemonRow = {
        ...mockRows[0],
        types: "grass,poison,special",
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithMultipleTypes],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0].types).toEqual(["grass", "poison", "special"]);
    });

    it("should handle single type correctly", async () => {
      const rowWithSingleType: PokemonRow = {
        ...mockRows[1],
        types: "fire",
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [rowWithSingleType],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0].types).toEqual(["fire"]);
    });

    it("should return empty data array when no results", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: [],
        total: 0,
      });

      const result = await service.list();

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it("should throw DatabaseError when repository throws", async () => {
      const repositoryError = new Error("Connection timeout");
      mockRepository.findPaginated.mockRejectedValue(repositoryError);

      await expect(service.list()).rejects.toThrow(DatabaseError);
      await expect(service.list()).rejects.toThrow("Failed to list pokémon");
    });

    it("should wrap original error in DatabaseError", async () => {
      const originalError = new Error("Network error");
      mockRepository.findPaginated.mockRejectedValue(originalError);

      try {
        await service.list();
        expect.fail("Should have thrown DatabaseError");
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toBe("Failed to list pokémon");
      }
    });

    it("should handle all filters combined", async () => {
      const dto: ListPokemonDTO = {
        search: "Char",
        type: "fire",
        sort: "name",
        order: "desc",
        page: 2,
        limit: 15,
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [mockRows[1]],
        total: 25,
      });

      const result = await service.list(dto);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        search: "Char",
        type: "fire",
        sort: "name",
        order: "desc",
        page: 2,
        limit: 15,
      });

      expect(result.meta).toEqual({
        page: 2,
        limit: 15,
        total: 25,
        totalPages: 2,
      });
    });

    it("should always include abilities as empty array", async () => {
      mockRepository.findPaginated.mockResolvedValue({
        rows: mockRows,
        total: 2,
      });

      const result = await service.list();

      result.data.forEach((pokemon) => {
        expect(pokemon.abilities).toEqual([]);
      });
    });

    it("should preserve original data from repository", async () => {
      const customRow: PokemonRow = {
        id: 999,
        name: "CustomMon",
        types: "electric,steel",
        imagePath: "/custom.png",
        height: 15,
        weight: 100,
        stats: [{ name: "speed", value: 120 }],
      };

      mockRepository.findPaginated.mockResolvedValue({
        rows: [customRow],
        total: 1,
      });

      const result = await service.list();

      expect(result.data[0]).toEqual({
        id: 999,
        name: "CustomMon",
        types: ["electric", "steel"],
        imagePath: "/custom.png",
        height: 15,
        weight: 100,
        stats: [{ name: "speed", value: 120 }],
        abilities: [],
      });
    });
  });
});
