/*
  Warnings:

  - You are about to drop the column `balanceId` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `balance_id` on the `Renter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Landlord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Renter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Landlord_balanceId_key";

-- DropIndex
DROP INDEX "Renter_balance_id_key";

-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "balanceId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Renter" DROP COLUMN "balance_id",
ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "balance_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_balance_id_key" ON "User"("balance_id");

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_userId_key" ON "Landlord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Renter_userId_key" ON "Renter"("userId");

-- AddForeignKey
ALTER TABLE "Renter" ADD CONSTRAINT "Renter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Landlord" ADD CONSTRAINT "Landlord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
