-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payPeriod" INTEGER NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_tenantId_key" ON "Balance"("tenantId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
