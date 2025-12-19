import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/shared/lib/db";

export interface FindPaginatedParams {
  search?: string;
  type?: string;
  sort: "id" | "name";
  order: "asc" | "desc";
  page: number;
  limit: number;
}

export class PokemonRepository {
  async findPaginated(params: FindPaginatedParams) {
    const { search, type, sort, order, page, limit } = params;

    const where: Prisma.PokemonWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    if (type) {
      where.types = {
        contains: type,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    const orderBy: Prisma.PokemonOrderByWithRelationInput = {
      [sort]: order,
    };

    const [rows, total] = await Promise.all([
      prisma.pokemon.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          types: true,
          imagePath: true,
          height: true,
          weight: true,
          stats: true,
        },
      }),
      prisma.pokemon.count({ where }),
    ]);

    return { rows, total };
  }
  async autocomplete(search: string, limit = 8) {
    if (!search.trim()) return [];

    return prisma.pokemon.findMany({
      where: {
        name: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
      select: {
        id: true,
        name: true,
      },
    });
  }

  // async findAllNamesSorted(): Promise<{ id: number; name: string }[]> {
  //   return prisma.pokemon.findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //     orderBy: {
  //       name: "asc",
  //     },
  //   });
  // }
}
