import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
    { optionsOnly } = { optionsOnly: false },
  ) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [
      'http://localhost:3000',
      process.env.CONVEX_SITE_URL!,
    ],
    baseURL: process.env.CONVEX_SITE_URL!,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }
    },
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
    // ? getSessionでsessionを取得できないため
    // クロスドメインでのCookie送信を許可
    advanced: {
      // セッションを24時間に設定
      sessionMaxAge: 24 * 60 * 60,
     // Cookie に Secure 属性を付与（HTTPS必須）
      useSecureCookies: true,

      // クロスオリジンで Cookie を送信するには SameSite=none が必要
      // 開発環境では lax、本番環境では none に設定
      defaultCookieAttributes: {
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      },
    },
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
