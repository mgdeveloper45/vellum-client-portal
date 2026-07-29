/*
  Warnings:

  - Changed the type of `mode` on the `ExecutiveBriefCache` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Create enum
CREATE TYPE "ExecutiveBriefMode" AS ENUM (
    'mock',
    'production'
);

-- Convert existing column
ALTER TABLE "ExecutiveBriefCache"
ALTER COLUMN "mode"
TYPE "ExecutiveBriefMode"
USING ("mode"::"ExecutiveBriefMode");

