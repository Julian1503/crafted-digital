import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { consumeRateLimit, getClientKey, isRateLimited } from "@/lib/http/rate-limit";
import { authConfig } from "@/lib/auth/auth.config";

/** Pre-computed cost-12 hash (same cost as the seeded admin) so a missing user costs the same as a wrong password. */
const DUMMY_HASH = "$2b$12$6qiuYFNLDsZmZzcibHj7BO3GPnAL1caC3/GOhoCQ.5aP.Nx5rU6gC";
const LOGIN_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };
const EMAIL_FAILURE_LIMIT = { limit: 20, windowMs: 15 * 60 * 1000 };

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        // Every attempt counts against the IP; only failures count against the email,
        // so a stranger cannot lock the owner out by spamming the address.
        const ip = request?.headers ? getClientKey(request as { headers: Headers }) : "unknown";
        const byIp = consumeRateLimit("login:ip", ip, LOGIN_LIMIT);
        if (!byIp.ok) return null;
        if (isRateLimited("login:email-failures", email, EMAIL_FAILURE_LIMIT.limit)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // Always run a compare so timing does not reveal whether the email exists.
        const valid = await bcrypt.compare(password, user?.hashedPassword ?? DUMMY_HASH);
        if (!user || !user.hashedPassword || !user.active || !valid) {
          consumeRateLimit("login:email-failures", email, EMAIL_FAILURE_LIMIT);
          return null;
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { roleAssigns: { include: { role: true } } },
        });
        // Deleted or deactivated users lose their session immediately.
        if (!dbUser || !dbUser.active) return null;
        token.roles = dbUser.roleAssigns.map((ra) => ra.role.name);
        token.active = dbUser.active;
      }
      return token;
    },
  },
});
