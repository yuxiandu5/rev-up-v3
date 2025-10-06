/*
  Warnings:

  - You are about to drop the column `productId` on the `MediaAsset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MediaAsset" DROP CONSTRAINT "MediaAsset_productId_fkey";

-- AlterTable
ALTER TABLE "public"."MediaAsset" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "imageUrl" TEXT;
