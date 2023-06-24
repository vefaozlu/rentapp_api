/*
  Warnings:

  - You are about to alter the column `title` on the `Announcement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `body` on the `Announcement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Landlord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `email` on the `Landlord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `phoneNumber` on the `Landlord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `address` on the `Landlord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `name` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `address` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `name` on the `Renter` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `email` on the `Renter` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `phoneNumber` on the `Renter` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `address` on the `Renter` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `name` on the `Unit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `firebaseId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.

*/
-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "title" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "body" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Landlord" ALTER COLUMN "name" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "name" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "Renter" ALTER COLUMN "name" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "Unit" ALTER COLUMN "name" SET DATA TYPE VARCHAR(55);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firebaseId" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(55);
