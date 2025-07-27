/*
  Warnings:

  - The `plan` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BASIC', 'PRO', 'SCALE');

-- CreateEnum
CREATE TYPE "PAYMENT_TYPE" AS ENUM ('CARD', 'UPI');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'BASIC';

-- DropEnum
DROP TYPE "Subscription";

-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymentType" "PAYMENT_TYPE" NOT NULL,
    "paymentLink" TEXT,
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardIssuingCountry" TEXT,
    "cardNetwork" TEXT,
    "billingId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Billing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
