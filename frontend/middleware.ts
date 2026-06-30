import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health"
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without any auth check
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // All other routes: require authentication
  const { userId } = await auth();
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Onboarding enforcement is handled client-side in the app layout/pages
  // to avoid stale JWT sessionClaims issues (publicMetadata is not in the
  // default Clerk session token without a custom JWT template in the dashboard)
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

