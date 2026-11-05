import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      overrideUserInfoOnSignIn: true, // use the github name and photo every single time when someone signs to github
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      overrideUserInfoOnSignIn: true, // Use the Google name and photo every time someone signs in with Google
    },
  },
  plugins: [nextCookies(), jwt(), nextCookies()],
});
