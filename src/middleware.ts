import { NextRequest, NextResponse } from "next/server";
import { verifyAccessJWT } from "./lib/jwt";

function redirectHome(baseUrl: string){
    return NextResponse.redirect(new URL("/", baseUrl));
}

export async function middleware(request: NextRequest) {
  try {    
    const accessToken = request.cookies.get("accessToken")?.value;
    if(!accessToken) {
      return redirectHome(request.url);
    }
  
    const userPayload = await verifyAccessJWT(accessToken);
    if(!userPayload) {
      return redirectHome(request.url);
    }
  
    if(userPayload.role !== "ADMIN" && userPayload.role !== "MODERATOR"){
      return redirectHome(request.url);
    }
  
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectHome(request.url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};