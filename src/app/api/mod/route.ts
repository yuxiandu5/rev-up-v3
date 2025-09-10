import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const yearRangeId = searchParams.get("yearRangeId");

    // Validate parameters early
    if (yearRangeId && !yearRangeId.match(/^[a-zA-Z0-9]+$/)) {
      return NextResponse.json({ error: "Invalid categoryId or yearRangeId" }, { status: 400 });
    }
    if (categoryId && !categoryId.match(/^[a-zA-Z0-9]+$/)) {
      return NextResponse.json({ error: "Invalid categoryId or yearRangeId" }, { status: 400 });
    }

    if (!yearRangeId && !categoryId) {
      const mods = await prisma.modCategory.findMany({
        select: {
          name: true,
          description: true,
          id: true,
          slug: true,
          mods: true,
        },
      });
      return NextResponse.json(mods);
    }


    if (categoryId && yearRangeId) {
      const mods = await prisma.mod.findMany({
        where: { modCategoryId: categoryId, },
        select: {
          category: true,
          name: true,
          id: true,
          slug: true,
          description: true,
          compatibilities: {
            where: {
              modelYearRangeId: yearRangeId
            }
          },
          dependentOn: {
            select: {
              prerequisiteCategory: true
            }
          }
        },
      });
    
      return NextResponse.json(mods);
    }



    if (categoryId) {
      const mods = await prisma.mod.findMany({
        where: { modCategoryId: categoryId },
      });
      return NextResponse.json(mods);
    }

    if (yearRangeId) {
      const mods = await prisma.mod.findMany({
        where: { compatibilities: { some: { modelYearRangeId: yearRangeId } } },
      });
      return NextResponse.json(mods);
    }
      
  } catch (error) {
    console.error("Error fetching mods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  }
}