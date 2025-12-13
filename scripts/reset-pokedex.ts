import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "@/shared/lib/db";

/**
 * ======================
 * CONFIG
 * ======================
 */
const IMAGE_DIR = path.join(process.cwd(), "public", "pokemon");

/**
 * ======================
 * HELPERS
 * ======================
 */
function deleteImages(): void {
  if (!fs.existsSync(IMAGE_DIR)) return;

  const files = fs.readdirSync(IMAGE_DIR);

  for (const file of files) {
    const fullPath = path.join(IMAGE_DIR, file);
    if (fs.statSync(fullPath).isFile()) {
      fs.unlinkSync(fullPath);
    }
  }

  console.log(`🧹 Deleted ${files.length} Pokémon images`);
}

/**
 * ======================
 * RESET DB
 * ======================
 */
async function resetDatabase(): Promise<void> {
  console.log("🧨 Resetting database…");

  /**
   * ⚠️ Ordem importa por causa de relações
   * Ajuste conforme seu schema Prisma
   */

  await prisma.$transaction([prisma.pokemon?.deleteMany?.()]);

  console.log("✅ Database cleaned");
}

/**
 * ======================
 * EXECUTION
 * ======================
 */
async function resetPokedex(): Promise<void> {
  console.log("♻️ Resetting Pokédex environment");

  await resetDatabase();
  deleteImages();

  console.log("🎉 Pokédex reset completed");
}

resetPokedex()
  .catch((err) => {
    console.error("🔥 Failed to reset Pokédex", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
