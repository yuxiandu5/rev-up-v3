/*
  Warnings:

  - You are about to drop the column `badgeId` on the `MediaAsset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MediaAsset" DROP CONSTRAINT "MediaAsset_badgeId_fkey";

-- AlterTable
ALTER TABLE "public"."MediaAsset" DROP COLUMN "badgeId",
ADD COLUMN     "modelYearRangeId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_modelYearRangeId_fkey" FOREIGN KEY ("modelYearRangeId") REFERENCES "public"."ModelYearRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
