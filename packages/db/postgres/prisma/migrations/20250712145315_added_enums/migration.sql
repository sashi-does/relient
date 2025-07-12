-- CreateEnum
CREATE TYPE "Focus" AS ENUM ('REALESTATE', 'LAWYERS', 'B2B', 'AUTOMATIVE', 'ECOM', 'MEDICAL');

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "focus" "Focus" NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);
