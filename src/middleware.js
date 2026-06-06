import { middlewareAuth } from "@/auth.config";

// Directly export the Auth.js Edge-compatible middleware instance
export default middlewareAuth;

// Configure the matcher to run the middleware on all administrative portal routes
export const config = {
  matcher: ["/admin/:path*"],
};
