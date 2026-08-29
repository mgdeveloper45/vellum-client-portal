-- Add the operation key as nullable first so this migration is safe
-- for environments that already contain historical deposit payments.
ALTER TABLE "DepositPayment"
ADD COLUMN "operationKey" TEXT;

-- Historical rows predate operation-level idempotency. Their existing
-- primary keys are unique, so use them to create deterministic legacy keys.
UPDATE "DepositPayment"
SET "operationKey" = 'legacy:' || "id"
WHERE "operationKey" IS NULL;

-- All rows now have a key, so enforce the application invariant.
ALTER TABLE "DepositPayment"
ALTER COLUMN "operationKey" SET NOT NULL;

-- The database is the final authority preventing duplicate operations.
CREATE UNIQUE INDEX "DepositPayment_operationKey_key"
ON "DepositPayment"("operationKey");
