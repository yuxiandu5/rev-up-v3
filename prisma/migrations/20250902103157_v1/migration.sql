-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recoverQuestion" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "prevTokenHash" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Make" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Make_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "makeId" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModelYearRange" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "chassis" TEXT,
    "hp" INTEGER NOT NULL,
    "torque" INTEGER NOT NULL,
    "zeroToHundred" INTEGER,
    "handling" INTEGER NOT NULL,

    CONSTRAINT "ModelYearRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ModCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "modCategoryId" TEXT,

    CONSTRAINT "Mod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModCompatibility" (
    "id" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "makeId" TEXT NOT NULL,
    "modelYearRange" TEXT NOT NULL,
    "modelYearRangeId" TEXT NOT NULL,
    "hpGain" INTEGER,
    "nmGain" INTEGER,
    "handlingDelta" INTEGER,
    "zeroToHundredDelta" INTEGER,
    "price" INTEGER,
    "notes" TEXT,

    CONSTRAINT "ModCompatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModRequirement" (
    "id" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "dependentId" TEXT NOT NULL,

    CONSTRAINT "ModRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "modId" TEXT,
    "modelYearRangeId" TEXT,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserBuild" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "nickname" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserBuildMod" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "modId" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3),

    CONSTRAINT "UserBuildMod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "public"."User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "public"."RefreshToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_prevTokenHash_key" ON "public"."RefreshToken"("prevTokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_expiresAt_idx" ON "public"."RefreshToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Make_name_key" ON "public"."Make"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Make_slug_key" ON "public"."Make"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_makeId_name_key" ON "public"."Model"("makeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_modelId_name_key" ON "public"."Badge"("modelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ModCategory_name_key" ON "public"."ModCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModCategory_slug_key" ON "public"."ModCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Mod_slug_key" ON "public"."Mod"("slug");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Model" ADD CONSTRAINT "Model_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "public"."Make"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Badge" ADD CONSTRAINT "Badge_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModelYearRange" ADD CONSTRAINT "ModelYearRange_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mod" ADD CONSTRAINT "Mod_modCategoryId_fkey" FOREIGN KEY ("modCategoryId") REFERENCES "public"."ModCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModCompatibility" ADD CONSTRAINT "ModCompatibility_modId_fkey" FOREIGN KEY ("modId") REFERENCES "public"."Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModRequirement" ADD CONSTRAINT "ModRequirement_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "public"."Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModRequirement" ADD CONSTRAINT "ModRequirement_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "public"."Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_modId_fkey" FOREIGN KEY ("modId") REFERENCES "public"."Mod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_modelYearRangeId_fkey" FOREIGN KEY ("modelYearRangeId") REFERENCES "public"."ModelYearRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBuild" ADD CONSTRAINT "UserBuild_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBuildMod" ADD CONSTRAINT "UserBuildMod_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "public"."UserBuild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBuildMod" ADD CONSTRAINT "UserBuildMod_modId_fkey" FOREIGN KEY ("modId") REFERENCES "public"."Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
