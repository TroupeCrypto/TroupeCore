import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/analytics") || pathname.startsWith("/agents")) {
    // Check for authentication token (example using a simple header or cookie)
    const authToken = request.cookies.get("auth-token")?.value;
    const authHeader = request.headers.get("authorization");

    // If no authentication is present, redirect to login or return 401
    if (!authToken && !authHeader) {
      // For now, add a custom header to indicate authentication is required
      // In production, you would redirect to a login page or return 401
      const response = NextResponse.next();
      response.headers.set("X-Auth-Required", "true");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/analytics/:path*",
    "/agents/:path*",
  ],
};
