import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const makeId = searchParams.get("makeId");
    const modelId = searchParams.get("modelId");
    const badgeId = searchParams.get("badgeId");
    const yearRangeId = searchParams.get("yearRangeId");

    // 1. Get all makes (no query params)
    if (!makeId && !modelId && !badgeId && !yearRangeId) {
      const makes = await prisma.make.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return NextResponse.json(makes);
    }

    // 2. Get models for a make
    if (makeId && !modelId && !badgeId && !yearRangeId) {
      const models = await prisma.model.findMany({
        where: {
          makeId: makeId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return NextResponse.json(models);
    }

    // 3. Get badges for a model
    if (modelId && !badgeId && !yearRangeId) {
      const badges = await prisma.badge.findMany({
        where: {
          modelId: modelId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return NextResponse.json(badges);
    }

    // 4. Get year ranges for a badge
    if (badgeId && !yearRangeId) {
      const yearRanges = await prisma.modelYearRange.findMany({
        where: {
          badgeId: badgeId,
        },
        select: {
          id: true,
          startYear: true,
          endYear: true,
          chassis: true,
          hp: true,
          torque: true,
          zeroToHundred: true,
          handling: true,
          mediaAsset: {
            select: {
              url: true,
              alt: true,
            },
            take: 1, // Get the first media asset
          },
        },
        orderBy: {
          startYear: "asc",
        },
      });

      // Transform the response to include url field as specified in your design
      const transformedYearRanges = yearRanges.map((yearRange) => ({
        id: yearRange.id,
        startYear: yearRange.startYear,
        endYear: yearRange.endYear,
        chassis: yearRange.chassis,
        hp: yearRange.hp,
        torque: yearRange.torque,
        zeroToHundred: yearRange.zeroToHundred,
        handling: yearRange.handling,
        url: yearRange.mediaAsset[0]?.url || "",
      }));

      return NextResponse.json(transformedYearRanges);
    }

    // Invalid query combination
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === "development") {
      console.error("Car API error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
