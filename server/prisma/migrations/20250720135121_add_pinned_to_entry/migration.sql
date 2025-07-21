-- AlterTable
ALTER TABLE "entry" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[];
