import { auth } from "@/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard") || 
                           req.nextUrl.pathname.startsWith("/rooms") || 
                           req.nextUrl.pathname.startsWith("/scrapers");

  if (isDashboardPage && !isAuth) {
    return Response.redirect(new URL("/auth/signin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
