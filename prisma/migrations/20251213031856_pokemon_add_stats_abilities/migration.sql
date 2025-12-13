-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "abilities" JSONB,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "weight" INTEGER;
