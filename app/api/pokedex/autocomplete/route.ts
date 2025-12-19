import { NextResponse } from "next/server";
import { PokemonRepository } from "@modules/pokedex/server/repositories/pokemon.repository";

const repo = new PokemonRepository();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  if (search.length < 2) {
    return NextResponse.json([]);
  }

  const result = await repo.autocomplete(search);

  return NextResponse.json(result);
}
