import { PokemonIngestionService } from "@modules/pokedex/server/services/pokemon-ingestion.service";
import prisma from "@/shared/lib/db";

async function main() {
  const service = new PokemonIngestionService();
  await service.run();
}

main()
  .catch((err) => {
    console.error("🔥 Fatal ingestion error", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
