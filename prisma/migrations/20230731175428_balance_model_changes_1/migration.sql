-- AlterTable
ALTER TABLE "Balance" ALTER COLUMN "balance" DROP NOT NULL,
ALTER COLUMN "balance" DROP DEFAULT,
ALTER COLUMN "payPeriod" DROP NOT NULL,
ALTER COLUMN "currentPeriodEnd" DROP NOT NULL,
ALTER COLUMN "currentPeriodEnd" DROP DEFAULT,
ALTER COLUMN "isActive" SET DEFAULT false;