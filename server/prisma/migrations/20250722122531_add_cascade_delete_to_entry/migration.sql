-- DropForeignKey
ALTER TABLE "entry" DROP CONSTRAINT "entry_authorId_fkey";

-- AddForeignKey
ALTER TABLE "entry" ADD CONSTRAINT "entry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
