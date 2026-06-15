import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const defaultCallbacks = {
  async jwt({ token, user }) {
    if (user) {
      token.user = user;
    }
    return token;
  },
  async session({ session, token }) {
    if (token?.user) {
      session.user = token.user;
    }
    return session;
  },
};

export const userAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "user-credentials",
      name: "User Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await compare(
          credentials.password,
          user.password,
        );
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
          role: "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: defaultCallbacks,
  secret: process.env.AUTH_SECRET || "change-me",
};

export const adminAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          return null;
        }

        const passwordMatches = await compare(
          credentials.password,
          admin.password,
        );
        if (!passwordMatches) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name || null,
          role: "admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: defaultCallbacks,
  secret: process.env.AUTH_SECRET || "change-me",
};
