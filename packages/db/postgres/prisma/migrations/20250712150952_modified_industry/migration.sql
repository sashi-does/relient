/*
  Warnings:

  - You are about to drop the column `focus` on the `Agency` table. All the data in the column will be lost.
  - Added the required column `industry` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('REALESTATE', 'LAWYERS', 'B2B', 'AUTOMOTIVE', 'ECOM', 'MEDICAL', 'HOME_SERVICES', 'COACHING_CONSULTING', 'SOLAR', 'INSURANCE', 'FINANCE', 'STAFFING', 'OTHER');

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "focus",
ADD COLUMN     "industry" "Industry" NOT NULL;

-- DropEnum
DROP TYPE "Focus";
