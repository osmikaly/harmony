import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check for registration page and redirect
  if (pathname.startsWith("/user/register")) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Allow access to group-pilgrim-connect-main project
  if (pathname.startsWith("/group-pilgrim-connect-main")) {
    return NextResponse.next()
  }

  // This is a simple client-side authentication check
  // In a real app, you would use a more secure server-side approach

  // For user dashboard routes
  if (req.nextUrl.pathname.startsWith("/user/dashboard")) {
    // We'll let the client-side code handle the authentication check
    // This is just to ensure the route exists
    return NextResponse.next()
  }

  return NextResponse.next()
}

