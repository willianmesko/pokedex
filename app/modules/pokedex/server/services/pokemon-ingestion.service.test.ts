import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { PokemonIngestionService } from "./pokemon-ingestion.service";
import prisma from "@/shared/lib/db";
import fs from "fs";
import path from "path";

// Mock dependencies
vi.mock("@/shared/lib/db", () => ({
  default: {
    pokemon: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn(),
  },
  join: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("PokemonIngestionService", () => {
  let service: PokemonIngestionService;

  const mockPokemonListResponse = {
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    ],
  };

  const mockPokemonDetails = {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    stats: [
      { stat: { name: "hp" }, base_stat: 45 },
      { stat: { name: "attack" }, base_stat: 49 },
      { stat: { name: "defense" }, base_stat: 49 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock path.join to return predictable paths
    vi.mocked(path.join).mockImplementation((...args: string[]) =>
      args.join("/")
    );

    // Mock fs functions
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);

    // Mock process.cwd()
    vi.spyOn(process, "cwd").mockReturnValue("/mock/path");

    service = new PokemonIngestionService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should create image directory if it does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      new PokemonIngestionService();

      expect(fs.mkdirSync).toHaveBeenCalledWith("/mock/path/public/pokemon", {
        recursive: true,
      });
    });

    it("should not create image directory if it already exists", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.mkdirSync).mockClear();

      new PokemonIngestionService();

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe("run", () => {
    beforeEach(() => {
      // Mock successful fetch responses
      mockFetch.mockImplementation((url: string) => {
        if (url.includes("?limit=151")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPokemonListResponse),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        if (url.includes("/pokemon/") && !url.includes("sprites")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPokemonDetails),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        if (url.includes("sprites") || url.includes("official-artwork")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      vi.mocked(prisma.pokemon.upsert).mockResolvedValue({} as never);
    });

    it("should fetch pokemon list and ingest all pokemon", async () => {
      await service.run();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledTimes(3);
    });

    it("should return success and failed counts", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await service.run();

      expect(consoleSpy).toHaveBeenCalledWith({ success: 3, failed: 0 });

      consoleSpy.mockRestore();
    });

    it("should handle failures gracefully", async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes("?limit=151")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPokemonListResponse),
          });
        }
        // Fail all detail fetches
        return Promise.reject(new Error("Network error"));
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await service.run();

      expect(consoleSpy).toHaveBeenCalledWith({ success: 0, failed: 3 });

      consoleSpy.mockRestore();
    });

    it("should process pokemon with concurrency limit", async () => {
      const startTimes: number[] = [];

      mockFetch.mockImplementation((url: string) => {
        startTimes.push(Date.now());
        if (url.includes("?limit=151")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                results: Array.from({ length: 10 }, (_, i) => ({
                  name: `pokemon${i}`,
                  url: `https://pokeapi.co/api/v2/pokemon/${i}/`,
                })),
              }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemonDetails),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        });
      });

      await service.run();

      // Should have processed all 10 pokemon
      expect(prisma.pokemon.upsert).toHaveBeenCalledTimes(10);
    });
  });

  describe("ingestSinglePokemon", () => {
    beforeEach(() => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/pokemon/1/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPokemonDetails),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        if (url.includes("sprites") || url.includes("official-artwork")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      vi.mocked(prisma.pokemon.upsert).mockResolvedValue({} as never);
    });

    it("should fetch pokemon details and save to database", async () => {
      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledWith({
        where: { id: 1 },
        update: {
          name: "bulbasaur",
          height: 7,
          weight: 69,
          types: "grass,poison",
          stats: [
            { name: "hp", value: 45 },
            { name: "attack", value: 49 },
            { name: "defense", value: 49 },
          ],
          imagePath: "/pokemon/1.png",
        },
        create: {
          id: 1,
          name: "bulbasaur",
          height: 7,
          weight: 69,
          types: "grass,poison",
          stats: [
            { name: "hp", value: 45 },
            { name: "attack", value: 49 },
            { name: "defense", value: 49 },
          ],
          imagePath: "/pokemon/1.png",
        },
      });
    });

    it("should join multiple types with comma", async () => {
      const pokemonWithManyTypes = {
        ...mockPokemonDetails,
        types: [
          { type: { name: "grass" } },
          { type: { name: "poison" } },
          { type: { name: "flying" } },
        ],
      };

      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/pokemon/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(pokemonWithManyTypes),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);
      });

      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            types: "grass,poison,flying",
          }),
        })
      );
    });

    it("should map stats correctly", async () => {
      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            stats: [
              { name: "hp", value: 45 },
              { name: "attack", value: 49 },
              { name: "defense", value: 49 },
            ],
          }),
        })
      );
    });

    it("should download image if it does not exist", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "/mock/path/public/pokemon/1.png",
        expect.any(Buffer)
      );
    });

    it("should not download image if it already exists", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      const writeFileSpy = vi.mocked(fs.writeFileSync);
      writeFileSpy.mockClear();

      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(writeFileSpy).not.toHaveBeenCalled();
    });
  });

  describe("fetchWithRetry", () => {
    it("should return response on successful fetch", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await service["fetchWithRetry"]("https://example.com");

      expect(result).toBe(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should retry on failed fetch", async () => {
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);

      await service["fetchWithRetry"]("https://example.com");

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("should retry on non-ok response", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);

      await service["fetchWithRetry"]("https://example.com");

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("should throw after max retries", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(
        service["fetchWithRetry"]("https://example.com")
      ).rejects.toThrow();

      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });

    it("should use exponential backoff delay", async () => {
      vi.useFakeTimers();

      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);

      const promise = service["fetchWithRetry"]("https://example.com", 3, 100);

      // Fast-forward through delays
      await vi.advanceTimersByTimeAsync(100); // First retry after 100ms
      await vi.advanceTimersByTimeAsync(200); // Second retry after 200ms

      await promise;

      vi.useRealTimers();
    });

    it("should accept custom retry count", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(
        service["fetchWithRetry"]("https://example.com", 5, 1) // Use 1ms delay for speed
      ).rejects.toThrow();

      expect(mockFetch).toHaveBeenCalledTimes(6); // 1 initial + 5 retries
    });

    it("should accept custom initial delay", async () => {
      vi.useFakeTimers();

      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);

      const promise = service["fetchWithRetry"]("https://example.com", 3, 1000);

      await vi.advanceTimersByTimeAsync(1000);

      await promise;

      vi.useRealTimers();
    });
  });

  describe("downloadImageIfNeeded", () => {
    it("should skip download if file exists", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      const writeFileSpy = vi.mocked(fs.writeFileSync);
      writeFileSpy.mockClear();

      await service["downloadImageIfNeeded"](
        "https://example.com/image.png",
        "/path/to/image.png"
      );

      expect(mockFetch).not.toHaveBeenCalled();
      expect(writeFileSpy).not.toHaveBeenCalled();
    });

    it("should download and save image if file does not exist", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const mockArrayBuffer = new ArrayBuffer(8);
      mockFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockArrayBuffer),
      } as never);

      await service["downloadImageIfNeeded"](
        "https://example.com/image.png",
        "/path/to/image.png"
      );

      expect(mockFetch).toHaveBeenCalledWith("https://example.com/image.png");
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "/path/to/image.png",
        expect.any(Buffer)
      );
    });

    it("should use fetchWithRetry for image download", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as never);

      await service["downloadImageIfNeeded"](
        "https://example.com/image.png",
        "/path/to/image.png"
      );

      // Should have retried
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("sleep", () => {
    it("should wait for specified milliseconds", async () => {
      vi.useFakeTimers();

      const promise = service["sleep"](1000);

      vi.advanceTimersByTime(999);
      expect(vi.getTimerCount()).toBe(1);

      vi.advanceTimersByTime(1);
      await promise;

      expect(vi.getTimerCount()).toBe(0);

      vi.useRealTimers();
    });
  });

  describe("integration scenarios", () => {
    it("should handle pokemon with single type", async () => {
      const singleTypePokemon = {
        ...mockPokemonDetails,
        types: [{ type: { name: "fire" } }],
      };

      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/pokemon/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(singleTypePokemon),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);
      });

      vi.mocked(prisma.pokemon.upsert).mockResolvedValue({} as never);

      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            types: "fire",
          }),
        })
      );
    });

    it("should handle pokemon with many stats", async () => {
      const pokemonWithManyStats = {
        ...mockPokemonDetails,
        stats: [
          { stat: { name: "hp" }, base_stat: 45 },
          { stat: { name: "attack" }, base_stat: 49 },
          { stat: { name: "defense" }, base_stat: 49 },
          { stat: { name: "special-attack" }, base_stat: 65 },
          { stat: { name: "special-defense" }, base_stat: 65 },
          { stat: { name: "speed" }, base_stat: 45 },
        ],
      };

      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/pokemon/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(pokemonWithManyStats),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);
      });

      vi.mocked(prisma.pokemon.upsert).mockResolvedValue({} as never);

      await service["ingestSinglePokemon"](
        "https://pokeapi.co/api/v2/pokemon/1/"
      );

      expect(prisma.pokemon.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            stats: expect.arrayContaining([
              { name: "hp", value: 45 },
              { name: "special-attack", value: 65 },
              { name: "speed", value: 45 },
            ]),
          }),
        })
      );
    });
  });
});
