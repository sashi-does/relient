/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Agency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamSize` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "teamSize" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agency_userId_key" ON "Agency"("userId");

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
