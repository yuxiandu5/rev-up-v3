import { NextRequest, NextResponse } from "next/server";
import { hashToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

function clearCookies(response: NextResponse) {
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 0, // Immediately expire the cookie
  });
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Immediately expire the cookie
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      // No token to revoke, but still clear cookie and return success
      const response = new NextResponse(null, { status: 204 });
      clearCookies(response);
      return response;
    }

    // Hash the token to find it in database
    const tokenHash = hashToken(refreshToken);

    // Find and revoke the refresh token
    const token = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (token && !token.revokedAt) {
      // Only revoke if token exists and isn't already revoked
      await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() },
      });
    }
    // Clear the refresh token cookie
    const response = new NextResponse(null, { status: 204 });
    clearCookies(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, we should still clear the cookie
    // to ensure the client doesn't keep a potentially invalid token
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });

    clearCookies(response);

    return response;
  }
}
