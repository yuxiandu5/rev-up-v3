import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-secret-key-change-in-production"
);

const ACCESS_TTL_MIN = parseInt(process.env.ACCESS_TTL_MIN || "15");

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role?: string;
  jti: string; // unique token id
}

export async function issueAccessJWT(payload: Omit<JWTPayload, "jti">): Promise<string> {
  const jti = crypto.randomUUID();
  const expirationTime = Math.floor(Date.now() / 1000) + (ACCESS_TTL_MIN * 60);

  const jwt = await new SignJWT({ 
    ...payload, 
    jti 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(JWT_SECRET);

  return jwt;
}

export async function verifyAccessJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload.sub || !payload.email || !payload.jti) {
      throw new Error("Invalid token payload");
    }

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string | undefined,
      jti: payload.jti as string,
    };
  } catch {
    throw new Error("Invalid or expired token");
  }
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
