/*
  Warnings:

  - The values [AUTOMATIVE] on the enum `Focus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Focus_new" AS ENUM ('REALESTATE', 'LAWYERS', 'B2B', 'AUTOMOTIVE', 'ECOM', 'MEDICAL', 'HOME_SERVICES', 'COACHING_CONSULTING', 'SOLAR', 'INSURANCE', 'FINANCE', 'STAFFING', 'OTHER');
ALTER TABLE "Agency" ALTER COLUMN "focus" TYPE "Focus_new" USING ("focus"::text::"Focus_new");
ALTER TYPE "Focus" RENAME TO "Focus_old";
ALTER TYPE "Focus_new" RENAME TO "Focus";
DROP TYPE "Focus_old";
COMMIT;
