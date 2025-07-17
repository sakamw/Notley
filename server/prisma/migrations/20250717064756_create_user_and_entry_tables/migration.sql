-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_img" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "entry" (
    "entry_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "entry_synopsis" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featured_img" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "entry_pkey" PRIMARY KEY ("entry_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_address_key" ON "user"("email_address");

-- AddForeignKey
ALTER TABLE "entry" ADD CONSTRAINT "entry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
