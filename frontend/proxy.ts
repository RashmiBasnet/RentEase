import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication.
const AUTH_ONLY = [
  "/home",
  "/rentals",
  "/bookings",
  "/history",
  "/locations",
  "/account",
];

// Routes that only make sense when logged OUT.
const GUEST_ONLY = ["/sign-in"];

// Next.js 16 Proxy (the renamed Middleware). Read cookies from the request —
// the `next/headers` cookie helpers are not available in this runtime.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isAuthed = Boolean(token);
  const { pathname } = request.nextUrl;

  // Logged-in users never see the public landing or the auth pages —
  // send them to their dashboard instead.
  if (
    isAuthed &&
    (pathname === "/" || GUEST_ONLY.some((p) => pathname.startsWith(p)))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Guests can't reach protected routes — bounce them to sign-in and
  // remember where they were headed.
  const isProtected = AUTH_ONLY.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isAuthed && isProtected) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the API, and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.).*)"],
};
