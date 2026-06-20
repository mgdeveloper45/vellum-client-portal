import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js configuration.
 * Uses a temporary credentials login while we build the app.
 * Later, this will connect to users stored in PostgreSQL.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
  },

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
