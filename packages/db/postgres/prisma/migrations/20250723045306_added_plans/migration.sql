-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('BASIC', 'PRO', 'SCALE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "plan" "Subscription" NOT NULL DEFAULT 'BASIC';
