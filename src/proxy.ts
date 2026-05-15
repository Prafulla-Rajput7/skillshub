import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/hr") && token?.role !== "HR") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    if (path.startsWith("/employee") && token?.role !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/hr", req.url));
    }
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ["/hr/:path*", "/employee/:path*"],
};
