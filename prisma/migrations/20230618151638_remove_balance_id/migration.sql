/*
  Warnings:

  - You are about to drop the column `balanceId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_balanceId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balanceId";
