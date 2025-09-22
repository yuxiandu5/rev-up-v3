import { errorToResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
  } catch (e) {
    console.log("Error GET/badges", e);
    return errorToResponse(e);
  }
}
