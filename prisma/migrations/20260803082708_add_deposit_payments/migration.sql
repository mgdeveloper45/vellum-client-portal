/*
  Warnings:

  - You are about to drop the column `paidAt` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Deposit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "paidAt",
DROP COLUMN "paymentMethod";

-- CreateTable
CREATE TABLE "DepositPayment" (
    "id" TEXT NOT NULL,
    "depositId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DepositPayment_depositId_idx" ON "DepositPayment"("depositId");

-- CreateIndex
CREATE INDEX "DepositPayment_receivedAt_idx" ON "DepositPayment"("receivedAt");

-- AddForeignKey
ALTER TABLE "DepositPayment" ADD CONSTRAINT "DepositPayment_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
