import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN } from "./constants/common.constants";

const protectedRoute = ["/"];

export function middleware(request: NextRequest): NextResponse | undefined {
  if (protectedRoute.includes(request.nextUrl.pathname)) {
    const user = request.cookies.has(ACCESS_TOKEN);
    if (!user) {
      const { href, origin } = request.nextUrl;
      const url = new URL(
        `${origin}/login?redirectUrl=${encodeURIComponent(
          `${href.replace(origin, "")}`
        )}`
      );
      return NextResponse.redirect(url);
    }
  }

  return undefined;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
