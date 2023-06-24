/*
  Warnings:

  - You are about to drop the column `deposit` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `isVacant` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `payPeriod` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `rentAmount` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `renterId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_renterId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "deposit",
DROP COLUMN "isVacant",
DROP COLUMN "payPeriod",
DROP COLUMN "rentAmount",
DROP COLUMN "renterId",
DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "payPeriod" INTEGER NOT NULL,
    "rentAmount" DECIMAL(65,30) NOT NULL,
    "deposit" DECIMAL(65,30) NOT NULL,
    "isVacant" BOOLEAN NOT NULL DEFAULT true,
    "propertyId" INTEGER NOT NULL,
    "renterId" INTEGER,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_renterId_key" ON "Unit"("renterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "Renter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
