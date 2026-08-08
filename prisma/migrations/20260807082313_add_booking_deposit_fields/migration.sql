/*
  Warnings:

  - A unique constraint covering the columns `[depositPaymentIntentId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "depositAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "depositPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "depositPaidAt" TIMESTAMP(3),
ADD COLUMN     "depositPaymentIntentId" TEXT,
ADD COLUMN     "depositRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_depositPaymentIntentId_key" ON "Booking"("depositPaymentIntentId");

-- CreateIndex
CREATE INDEX "Booking_depositPaid_idx" ON "Booking"("depositPaid");
