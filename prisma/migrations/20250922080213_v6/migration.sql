-- DropForeignKey
ALTER TABLE "public"."MediaAsset" DROP CONSTRAINT "MediaAsset_modelYearRangeId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_modelYearRangeId_fkey" FOREIGN KEY ("modelYearRangeId") REFERENCES "public"."ModelYearRange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
