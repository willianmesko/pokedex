import { NextRequest, NextResponse } from "next/server";
import { listPokemonQuerySchema } from "@modules/pokedex/validation/list-pokemon.schema";
import { PokemonService } from "@modules/pokedex/server/services/pokemon.service";
import { DatabaseError } from "@/shared/errors/database-error";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = listPokemonQuerySchema.safeParse({
    search: searchParams.get("search") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: searchParams.get("order") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        errors: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const service = new PokemonService();

  try {
    const result = await service.list(parsed.data);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    if (err instanceof DatabaseError) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    throw err;
  }
}
