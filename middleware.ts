import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/admin/login" ||
    path === "/about" ||
    path === "/contact" ||
    path.startsWith("/api/auth/")

  // Get the token from the session
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check if trying to access admin routes without admin role
  if (path.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/survey/:path*",
    "/recommendations/:path*",
    "/gift/:path*",
    "/admin/:path*",
    "/api/recommendations/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/saved-gifts/:path*",
    "/history/:path*",
  ],
}
