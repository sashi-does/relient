import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
      async authorize(credentials) {
        const email = credentials?.email;
        const user = await prisma.user.findFirst({
          where: { email },
        });
        if (user && user.password) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // optional: create a custom error page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user?.email) {
          console.error("Google sign-in failed: No email returned");
          return false;
        }

        try {
          let dbUser = await prisma.user.findFirst({
            where: { email: user.email },
          });

          const imageFromProfile =
            user.image ||
            (typeof profile === "object" &&
            profile &&
            "picture" in profile
              ? (profile as { picture?: string }).picture
              : null) ||
            null;

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                username: user.name || profile?.name || "",
                image: imageFromProfile,
                password: null, // Make sure password is optional in your Prisma schema
              },
            });
            console.log("Created new user:", dbUser);
          } else {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                username: user.name || profile?.name || dbUser.username,
                image: imageFromProfile || dbUser.image,
              },
            });
            console.log("Updated existing user:", dbUser);
          }
        } catch (err) {
          console.error("Error during Google sign-in:", err);
          return false;
        }
      }

      return true;
    },

    async session({ session }) {
      try {
        if ((session.user as { email: string })?.email) {
          const dbUser = await prisma.user.findFirst({
            where: { email: (session.user as { email: string })?.email },
          });
          if (dbUser) {
            (session.user as { id: string }).id = dbUser.id;
          } else {
            console.warn("No DB user found in session callback");
          }
        }
      } catch (e) {
        console.error("Session callback error:", e);
      }
      return session;
    }
    
  },
};

export default options;
