import { errorToResponse, okPaginated, ok } from "@/lib/apiResponse";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { MakeCreateSchema, PaginationSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { toSlug } from "@/lib/utils";

export async function GET(req:NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"])

    const { searchParams} = new URL(req.url)
    
    const {page, pageSize} = PaginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined
    })

    const [makeData, totalMakeCount] = await Promise.all([
      prisma.make.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.make.count()
    ])

    return okPaginated(makeData, page, pageSize, totalMakeCount, "Successfully fetched Make data!")
  } catch (e) {
    console.log("Error GET/makes", e)
    return errorToResponse(e)
  }
}

export async function POST(req:NextRequest) {
  try {
    await requireRole(req, ["ADMIN", "MODERATOR"])

    const body = await req.json()
    const {name, slug} = MakeCreateSchema.parse(body)

    const res = await prisma.make.create({
      data: {
        name,
        slug: slug ?? toSlug(name)
      }
    })

    return ok(res, "Make Created!", 201)
  } catch (e) {
    console.log("POST /makes failed: ", e)
    return errorToResponse(e)
  }
}