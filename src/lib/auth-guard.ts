import { NextRequest } from "next/server";
import { extractBearerToken, verifyAccessJWT, JWTPayload } from "./jwt";
import { Role } from "@/types/DTO/dtos";
import { UnauthorizedError, ForbiddenError } from "./errors/AppError";

export async function requireAuth(req: NextRequest): Promise<JWTPayload> {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) {
    throw new UnauthorizedError();
  }
  try {
    const userPayload = await verifyAccessJWT(token);
    return userPayload;
  } catch {
    throw new UnauthorizedError();
  }
}

export async function requireRole(req: NextRequest, allowedRoles: Role[]): Promise<JWTPayload> {
  const userPayload = await requireAuth(req);
  if (!allowedRoles.includes(userPayload.role as Role)) {
    throw new ForbiddenError("You have no access");
  }
  return userPayload;
}
