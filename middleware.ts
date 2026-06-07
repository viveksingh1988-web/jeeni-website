import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Stamp the current pathname into a request header so the root layout (a
   server component) can read it and suppress the site chrome on /studio. */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-current-path", req.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
