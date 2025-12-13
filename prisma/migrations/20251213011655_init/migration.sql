-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "types" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);
