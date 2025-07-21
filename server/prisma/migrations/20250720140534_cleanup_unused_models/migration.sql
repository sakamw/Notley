/*
  Warnings:

  - You are about to drop the column `categoryId` on the `entry` table. All the data in the column will be lost.
  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_entryId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "entry" DROP CONSTRAINT "entry_categoryId_fkey";

-- AlterTable
ALTER TABLE "entry" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "ActivityLog";

-- DropTable
DROP TABLE "Category";
