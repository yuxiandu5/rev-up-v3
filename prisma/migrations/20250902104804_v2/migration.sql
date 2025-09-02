/*
  Warnings:

  - You are about to drop the column `prerequisiteId` on the `ModRequirement` table. All the data in the column will be lost.
  - Added the required column `prerequisiteCategoryId` to the `ModRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ModRequirement" DROP CONSTRAINT "ModRequirement_prerequisiteId_fkey";

-- AlterTable
ALTER TABLE "public"."ModRequirement" DROP COLUMN "prerequisiteId",
ADD COLUMN     "prerequisiteCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ModRequirement" ADD CONSTRAINT "ModRequirement_prerequisiteCategoryId_fkey" FOREIGN KEY ("prerequisiteCategoryId") REFERENCES "public"."ModCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
