import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js configuration.
 * For now, this uses a simple credentials login so we can protect routes.
 * Later, we can connect this to real users in PostgreSQL.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (email === "admin@vellum.app" && password === "password123") {
          return {
            id: "1",
            name: "Vellum Admin",
            email: "admin@vellum.app",
          };
        }

        return null;
      },
    }),
  ],
});