import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Apply Clerk middleware to all routes except _next, static, and favicon.ico
};
