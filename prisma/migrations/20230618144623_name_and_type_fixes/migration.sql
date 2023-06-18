/*
  Warnings:

  - You are about to drop the column `adress` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `Renter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Landlord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Renter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Renter` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `Renter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Renter" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_phoneNumber_key" ON "Landlord"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Renter_phoneNumber_key" ON "Renter"("phoneNumber");
