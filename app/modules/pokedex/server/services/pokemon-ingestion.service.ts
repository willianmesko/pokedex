import "dotenv/config";
import fs from "fs";
import path from "path";
import pLimit from "p-limit";
import prisma from "@/shared/lib/db";

interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

export class PokemonIngestionService {
  private readonly POKE_API = "https://pokeapi.co/api/v2/pokemon";
  private readonly TOTAL_POKEMON = 151;
  private readonly CONCURRENCY = 5;
  private readonly IMAGE_DIR = path.join(process.cwd(), "public", "pokemon");
  private readonly limit = pLimit(this.CONCURRENCY);

  constructor() {
    this.ensureImageDir();
  }

  async run(): Promise<void> {
    const list = await this.fetchPokemonList();

    let success = 0;
    let failed = 0;

    await Promise.all(
      list.results.map((item) =>
        this.limit(async () => {
          try {
            await this.ingestSinglePokemon(item.url);
            success++;
          } catch {
            failed++;
          }
        })
      )
    );

    console.log({ success, failed });
  }

  private async ingestSinglePokemon(url: string): Promise<void> {
    const data = await this.fetchPokemonDetails(url);

    const { id, name, height, weight } = data;

    const types = data.types.map((t) => t.type.name).join(",");

    const stats = data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    }));

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    const imagePath = `/pokemon/${id}.png`;
    const imageFile = path.join(this.IMAGE_DIR, `${id}.png`);

    await this.downloadImageIfNeeded(imageUrl, imageFile);

    await prisma.pokemon.upsert({
      where: { id },
      update: {
        name,
        height,
        weight,
        types,
        stats,
        imagePath,
      },
      create: {
        id,
        name,
        height,
        weight,
        types,
        stats,
        imagePath,
      },
    });
  }

  private async fetchPokemonList(): Promise<PokemonListResponse> {
    const res = await this.fetchWithRetry(
      `${this.POKE_API}?limit=${this.TOTAL_POKEMON}&offset=0`
    );
    return res.json();
  }

  private async fetchPokemonDetails(
    url: string
  ): Promise<PokemonDetailsResponse> {
    const res = await this.fetchWithRetry(url);
    return res.json();
  }

  private ensureImageDir(): void {
    if (!fs.existsSync(this.IMAGE_DIR)) {
      fs.mkdirSync(this.IMAGE_DIR, { recursive: true });
    }
  }

  private async downloadImageIfNeeded(
    url: string,
    filePath: string
  ): Promise<void> {
    if (fs.existsSync(filePath)) return;

    const res = await this.fetchWithRetry(url);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
  }

  private async fetchWithRetry(
    url: string,
    retries = 3,
    delay = 500
  ): Promise<Response> {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return res;
    } catch {
      if (retries === 0) throw new Error();
      await this.sleep(delay);
      return this.fetchWithRetry(url, retries - 1, delay * 2);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
