/*
  Warnings:

  - You are about to drop the column `phone_number` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Renter` table. All the data in the column will be lost.
  - You are about to drop the column `balance_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[balanceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `Landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_balance_id_key";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "phone_number",
ADD COLUMN     "phoneNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Renter" DROP COLUMN "phone_number",
ADD COLUMN     "phoneNumber" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance_id",
ADD COLUMN     "balanceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_balanceId_key" ON "User"("balanceId");
