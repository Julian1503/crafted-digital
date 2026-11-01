/**
 * @fileoverview Edge-safe Auth.js settings shared by the proxy and the full config.
 *
 * No database, no Node-only imports: the proxy only needs to decode the JWT
 * to know whether a session exists. Role checks and the "user still active"
 * check run in the full config (`auth.ts`), which every admin page and API
 * route calls.
 */
import type { NextAuthConfig } from "next-auth";

export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

export const authConfig = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.roles = (token.roles as string[]) || [];
        session.active = token.active as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
