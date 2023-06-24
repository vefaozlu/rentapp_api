/*
  Warnings:

  - You are about to drop the column `renterId` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the `Renter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenantId]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Renter" DROP CONSTRAINT "Renter_userId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_renterId_fkey";

-- DropIndex
DROP INDEX "Unit_renterId_key";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "renterId",
ADD COLUMN     "tenantId" INTEGER;

-- DropTable
DROP TABLE "Renter";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(55) NOT NULL,
    "email" VARCHAR(55),
    "address" VARCHAR(128) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_phoneNumber_key" ON "Tenant"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "Tenant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_tenantId_key" ON "Unit"("tenantId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
