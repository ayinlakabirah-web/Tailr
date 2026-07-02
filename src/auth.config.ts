import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth",
    newUser: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      
      const protectedRoutes = ["/dashboard", "/customers", "/orders", "/payments", "/deliveries", "/onboarding"];
      const publicRoutes = ["/auth", "/auth/forgot-password", "/auth/reset-password", "/"];
      
      const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
      const isPublicRoute = publicRoutes.some(route => path === route || (route === "/auth" && path.startsWith("/auth")));

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isPublicRoute && isLoggedIn && path !== "/") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
