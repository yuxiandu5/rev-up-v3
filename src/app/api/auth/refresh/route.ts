import { NextRequest, NextResponse } from "next/server";
import { generateToken, hashToken, addDays } from "@/lib/crypto";
import { issueAccessJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || "14");

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // Hash the presented token to find it in database
    const tokenHash = hashToken(refreshToken);

    // Find the refresh token
    const token = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    // Validate token exists and is valid
    if (!token) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Check if token is revoked
    if (token.revokedAt) {
      return NextResponse.json(
        { error: "Refresh token has been revoked" },
        { status: 401 }
      );
    }

    // Check if token is already consumed (replay detection)
    if (token.consumedAt) {
      // This is a replay attack - revoke the entire token chain
      await revokeTokenChain(token.userId, token.tokenHash);
      return NextResponse.json(
        { error: "Token replay detected - all sessions revoked" },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (token.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Refresh token has expired" },
        { status: 401 }
      );
    }

    // Check if user is still active
    if (!token.user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Generate new refresh token
    const newRefreshToken = generateToken();
    const newTokenHash = hashToken(newRefreshToken);

    // Get client info
    const userAgent = request.headers.get("user-agent") || null;
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";

    // Rotate refresh token (mark old as consumed, create new)
    await prisma.$transaction([
      // Mark current token as consumed
      prisma.refreshToken.update({
        where: { id: token.id },
        data: { consumedAt: new Date() }
      }),
      // Create new refresh token with prevTokenHash chain
      prisma.refreshToken.create({
        data: {
          userId: token.userId,
          tokenHash: newTokenHash,
          prevTokenHash: token.tokenHash,
          userAgent,
          ipAddress,
          expiresAt: addDays(new Date(), REFRESH_TTL_DAYS),
        }
      })
    ]);

    // Issue new access JWT
    const accessToken = await issueAccessJWT({
      sub: token.user.id,
      userName: token.user.userName,
    });

    // Set new refresh token cookie
    const response = NextResponse.json(
      { accessToken, user: { id: token.user.id, userName: token.user.userName } }, 
      { status: 200 });
    
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to revoke an entire token chain (for replay detection)
async function revokeTokenChain(userId: string, startTokenHash: string): Promise<void> {
  try {
    // Find all tokens in the chain and revoke them
    // This includes the current token and any tokens that reference it
    await prisma.$transaction(async (tx) => {
      // Revoke all non-revoked tokens for this user that are part of the chain
      await tx.refreshToken.updateMany({
        where: {
          userId,
          OR: [
            { tokenHash: startTokenHash },
            { prevTokenHash: startTokenHash }
          ],
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      });

      // Also revoke any tokens that might chain from the tokens we just found
      const chainedTokens = await tx.refreshToken.findMany({
        where: {
          userId,
          prevTokenHash: startTokenHash,
          revokedAt: null
        },
        select: { tokenHash: true }
      });

      for (const chainedToken of chainedTokens) {
        await tx.refreshToken.updateMany({
          where: {
            userId,
            prevTokenHash: chainedToken.tokenHash,
            revokedAt: null
          },
          data: { revokedAt: new Date() }
        });
      }
    });
  } catch (error) {
    console.error("Error revoking token chain:", error);
    // Still continue execution - the replay detection is more important
    // than perfectly cleaning up the chain
  }
}
