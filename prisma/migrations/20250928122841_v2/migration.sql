/*
  Warnings:

  - A unique constraint covering the columns `[modId]` on the table `MediaAsset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MediaAsset" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_modId_key" ON "public"."MediaAsset"("modId");
