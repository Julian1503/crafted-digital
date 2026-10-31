import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { isTrustedOrigin } from "@/lib/http/origin";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (isApiAdminRoute && !req.auth) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  // CSRF: admin writes must come from this site (Origin / Referer / Sec-Fetch-Site).
  // Behind a reverse proxy the public host is in x-forwarded-host, not nextUrl.
  const publicHost = req.headers.get("x-forwarded-host")?.split(",")[0].trim() || req.nextUrl.host;
  if (isApiAdminRoute && !isTrustedOrigin(req.headers, publicHost, req.method)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Cross-site request rejected" } }, { status: 403 });
  }

  if (isAdminRoute && !req.auth) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
