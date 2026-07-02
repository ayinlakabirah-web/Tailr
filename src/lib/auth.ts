import { auth } from "@/auth";

/**
 * Retrieves the current session using Auth.js.
 * This replaces the legacy custom JWT session handling.
 */
export async function getSession() {
  const session = await auth();
  if (!session) return null;
  return {
    userId: session.user?.id,
    user: session.user,
  };
}

/**
 * Vendor-scoping helper: retrieves the current authenticated vendor's ID.
 * This is used throughout the app to ensure data isolation.
 */
export async function getVendorId(): Promise<string | null> {
  const session = await auth();
  if (!session || !session.user?.id) return null;
  return session.user.id;
}

// These are now handled by Auth.js but kept as stubs if referenced elsewhere temporarily
export async function setSession(userId: string) {
  console.warn("setSession is deprecated. Use signIn() from Auth.js instead.");
}

export async function logout() {
  console.warn("logout is deprecated. Use signOut() from Auth.js instead.");
}

export const SESSION_COOKIE_NAME = "authjs.session-token"; // Default for Auth.js
