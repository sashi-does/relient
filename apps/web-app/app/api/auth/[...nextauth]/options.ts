import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@repo/db/prisma";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (user && user.password) { // Only allow if password matches (add your password verification logic)
          return user;
        } else {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Single page for both sign-in and sign-up
    // No newUser page since /auth/signin handles new users
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        console.log("Google Sign-In Attempt:", { user, account, profile });
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          console.log("Found User:", dbUser);
    
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: user.name || profile?.name || "",
                image: user.image || profile?.picture || null,
                password: null,
              },
            });
            console.log("Created User:", dbUser);
          } else {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                username: user.name || profile?.name || dbUser.username,
                image: user.image || profile?.picture || dbUser.image,
              },
            });
            console.log("Updated User:", dbUser);
          }
        } catch (error) {
          console.error("Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });
        session.user.id = dbUser?.id; // Add user ID to session
      }
      return session;
    },
  },
};

export default options;