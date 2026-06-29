import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// 1.4: All protected routes redirect to /login if unauthenticated
const PROTECTED_PATHS = ["/profile", "/orders", "/wishlist", "/checkout"];

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Auto-generate cart_token UUID if missing
  const cartToken = request.cookies.get("cart_token")?.value;
  if (!cartToken) {
    response.cookies.set("cart_token", uuidv4(), {
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // Route protection
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected) {
    const token = request.cookies.get("token")?.value;
    if (!token || isTokenExpired(token)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      const redirect = NextResponse.redirect(url);
      redirect.cookies.delete("token");
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
