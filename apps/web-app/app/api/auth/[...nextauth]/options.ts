import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"
import prisma from "@repo/db/prisma"

const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "email", type: "email", placeholder: "Email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const email = credentials?.email
            const password = credentials?.password
            const user = await prisma.user.findFirst({
              where: {
                email
              }
            })
            if (user) {
              return user
            } else {

              return null
      

            }
          }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
          }),
    ],
    pages: {
      signIn: '/auth/signin',
      // signUp: '/auth/signup',
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // (used for check email message)
      newUser: '/user/onboarding' // New users will be directed here on first sign in (leave the property out if not of interest)
    } 
}

export default options