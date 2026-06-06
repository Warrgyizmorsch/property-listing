import NextAuth from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";
      
      // Only protect admin sub-routes
      if (nextUrl.pathname.startsWith("/admin")) {
        if (isLoginPage) {
          if (isLoggedIn) {
            // 1. Redirect authenticated users away from the login screen to the dashboard
            return Response.redirect(new URL("/admin/dashboard", nextUrl.origin));
          }
          // 2. Allow unauthenticated users to access the login page
          return true;
        }
        
        // 3. Force login for all other /admin routes (returns false -> triggers login redirect)
        return isLoggedIn;
      }
      
      return true; // Allow all other public routes
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Configured with empty providers for Edge middleware compatibility
  secret: process.env.NEXTAUTH_SECRET,
};

// Export a lightweight, Edge-compatible NextAuth instance for middleware checks
export const { auth: middlewareAuth } = NextAuth(authConfig);
