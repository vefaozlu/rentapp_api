/*
  Warnings:

  - A unique constraint covering the columns `[balanceId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `balanceId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "balanceId" VARCHAR(24) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_balanceId_key" ON "Tenant"("balanceId");
