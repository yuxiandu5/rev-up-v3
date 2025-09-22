/*
  Warnings:

  - A unique constraint covering the columns `[modelYearRangeId]` on the table `MediaAsset` will be added. If there are existing duplicate values, this will fail.
  - Made the column `zeroToHundred` on table `ModelYearRange` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ModelYearRange" ALTER COLUMN "zeroToHundred" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_modelYearRangeId_key" ON "public"."MediaAsset"("modelYearRangeId");
