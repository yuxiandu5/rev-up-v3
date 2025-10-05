/*
  Warnings:

  - Made the column `unitPriceCents` on table `CartItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CartItem" ALTER COLUMN "unitPriceCents" SET NOT NULL;
