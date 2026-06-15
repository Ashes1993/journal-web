import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Inject a secure backdoar credentials login only during test runner execution windows
    ...(process.env.PLAYWRIGHT_TEST === "true"
      ? [
          Credentials({
            name: "TestCredentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (
                credentials?.email === "testuser@example.com" &&
                credentials?.password === "password123"
              ) {
                // Returns a mock user configuration matching prisma database schema expectations
                return {
                  id: "test-user-uuid-12345",
                  name: "Test User",
                  email: "testuser@example.com",
                };
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: process.env.PLAYWRIGHT_TEST === "true" ? undefined : "/login",
  },
});
