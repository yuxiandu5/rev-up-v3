/*
  Warnings:

  - You are about to drop the column `badgeId` on the `UserBuild` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `UserBuild` table. All the data in the column will be lost.
  - You are about to drop the `UserBuildMod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `baseSpecs` to the `UserBuild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedCar` to the `UserBuild` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedMods` to the `UserBuild` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserBuild" DROP CONSTRAINT "UserBuild_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserBuildMod" DROP CONSTRAINT "UserBuildMod_buildId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserBuildMod" DROP CONSTRAINT "UserBuildMod_modId_fkey";

-- AlterTable
ALTER TABLE "public"."UserBuild" DROP COLUMN "badgeId",
DROP COLUMN "year",
ADD COLUMN     "baseSpecs" JSONB NOT NULL,
ADD COLUMN     "selectedCar" JSONB NOT NULL,
ADD COLUMN     "selectedMods" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."UserBuildMod";

-- CreateIndex
CREATE INDEX "UserBuild_userId_idx" ON "public"."UserBuild"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserBuild" ADD CONSTRAINT "UserBuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
