/*
  Warnings:

  - You are about to drop the column `balanceId` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tenant_balanceId_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "balanceId";
